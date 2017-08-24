'use strict';

// External
const Hapi = require('hapi');
const mongoose = require('mongoose');
const _ = require('lodash');
const Promise = require('promise');
const DAL = require('./dal/dal.js');
const scheduleService = require('./services/scheduleService.js');
const contractsCtrl = require('./controllers/contractsCtrl.js');
const config = require('./config.js');
const Mailer = require('./services/mailer.js');

module.exports = function() {
  mongoose.connect('mongodb://localhost/carTowing', err => {
    if (err) {
      throw new Error('Error connecting to mongodb');
    }
  });

  // Migration
  const migrations = require('./migrations/migrations');
  console.log('-| Migrations start');
  migrations(() => {
    console.log('-| Migrations end');
    startServer();
  });
};

function startServer() {
  const server = new Hapi.Server();
  server.connection({
    port: 8080,
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  });

  const cbBinded = _.bind(
    (server, err) => {
      if (err) throw err;
      const routing = require('./routing');
      routing.init(server);
    },
    null,
    server
  );

  const registerDone = _.bind(
    (server, err) => {
      if (err) throw err; // something bad happened loading the plugin
      registerStaticFilesServer(server, cbBinded);

      server.start(err => {
        if (err) throw err;
        configureServer(server);
        server.log('info', 'Server running at: ' + server.info.uri);
      });
    },
    null,
    server
  );

  registerACL(server).then(() => registerLoging(server))
    .then(() => registerAuth(server))
    .then(() => setScheduledJobs())
    .then(() => notifyAboutStarting())
    .then(() => registerDone())
    .catch(err => { throw new Error(err); });
}

function notifyAboutStarting() {
  try {
    console.log('Notyfying about running');
    if (!config.debugMode) {
      const date = new Date();
      const message = 'Server ran at ' + date.toString();

      const mail = {
        to: config.mail.user, // list of receivers
        subject: message, // Subject line
        text: message, // plaintext body
        html: '<div style="white-space: pre;">' + message + '</div>' // html body
      };

      return Mailer(config.mail).send(mail);
    } else {
      return Promise.resolve();
    }
  } catch (err) {
    console.error(err);
  }
}

function registerACL(server) {
  return new Promise(
    (resolve, reject) => require('./acl.js')(
      server,
      err => {
        if (err) {
          console.log(err);
          reject();
        } else {
          resolve();
        }
      }
    )
  );
}

function registerAuth(server) {
  return new Promise((resolve, reject) => {
    const AuthHeader = require('hapi-auth-header');

    server.register(AuthHeader, err => {
      if (err) {
        reject();
      } else {
        server.auth.strategy('simple', 'auth-header', {
          accessTokenName: 'X-CART-Token', // optional, 'access_token' by default
          validateFunc(tokens, callback) {
            // For convenience, the request object can be accessed
            // from `this` within validateFunc.
            const headerName = 'X-CART-Token';
            DAL.users.getUserByToken(tokens[headerName], (err, user) => {
              if (user) {
                callback(null, true, user);
              } else {
                callback(null, false, null);
              }
            });
          }
        });

        resolve();
      }
    });
  });
}

// Configure cookies for Hapi server
function configureServer(server) {
  // TODO: review all params
  server.state('session', {
    path: '/',
    ttl: 253402300000000,
    isSecure: false,
    isHttpOnly: false,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: false // don't allow violations of RFC 6265
  });
}

function registerStaticFilesServer(server, cb) {
  try {
    const plugin = require('inert');

    server.register(plugin, cb);
  } catch (err) {
    console.error(err);
  }
}

function registerLoging(server) {
  return new Promise((resolve, reject) => {
    const Good = require('good');
    server.register({
      register: Good,
      options: {
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              response: '*',
              log: '*'
            }]
          }, {
            module: 'good-console'
          }, 'stdout']
        }
      }
    }, err => {
      err ? reject() : resolve();
    });
  });
}

function setScheduledJobs() {
  try {
    console.log('Setting scheduled jobs');

    scheduleService.createDaylyJob(() => {
      try {
        contractsCtrl.sendNotifications();
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
