'use strict';

// External
const Hapi = require('hapi');
const mongoose = require('mongoose');
const _ = require('lodash');
const Promise = require('promise');
const DAL = require('./dal/dal.js');

mongoose.connect('mongodb://localhost/carTowing', function(err) {
  if (err)  {
    throw 'Error connecting to mongodb';
  }
});

// Migration
const migrations = require('./migrations/migrations');
console.log('-| Migrations start');
migrations(function () {
  console.log('-| Migrations end');
  startServer();
});

function registerStaticFilesServer(server, cb) {
  const plugin = require('inert');

  server.register(plugin, cb);
}

function registerLoging(server) {
  return new Promise(function (resolve, reject) {
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
    }, function (err) {
      err ? reject() : resolve();
    });
  });
}

// Configure cookies for Hapi server
let configureServer = (server) => {
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

function startServer() {
  const server = new Hapi.Server();
  server.connection( {port: 8080, routes: {cors: {origin: ['*'],credentials : true}}} );

  const cbBinded = _.bind(
    function (server, err) {
      if (err) throw err
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

      server.start((err) => {
        if (err) throw err;
        configureServer(server);
        server.log('info', 'Server running at: ' + server.info.uri);
      });
    },
    null,
    server
  );

  registerACL(server).then(function () {
    return registerLoging(server);
  }).then(function () {
    return registerAuth(server);
  }).then(function () {
    return registerDone();
  });
}

function registerACL(server) {
  return new Promise(function (resolve, reject) {
    require('./acl.js')(server, function(err) {
      if (err) {
        console.log(err);
        reject();
      } else {
        resolve();
      }
    });
  });
}

function registerAuth(server) {
  return new Promise(function (resolve, reject) {
     const AuthHeader = require('hapi-auth-header');

    server.register(AuthHeader, (err) => {
      if (err) {
        reject();
      } else {
         server.auth.strategy('simple', 'auth-header', {
          accessTokenName: 'X-CART-Token',    // optional, 'access_token' by default
          validateFunc: function (tokens, callback) {
            // For convenience, the request object can be accessed
            // from `this` within validateFunc.
            var request = this;
            var headerName = 'X-CART-Token';
            console.log(tokens, 'tokens--------------------------------');
             DAL.users.getUserByToken(tokens[headerName], function (err, user) {
              if (user) {
                console.log(user, '==========================');
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