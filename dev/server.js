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

function startServer() {
  const server = new Hapi.Server();
  server.connection({ port: 3000 });

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
    var permissionsFunc = function(credentials, callback) {
      // use credentials here to retrieve permissions for user 
      // in this example we just return some permissions 
      console.log(credentials);

      var userPermissions = {
        properties: {
          read: true,
          create: false,
          edit: true,
          delete: true
        },
        drivers: {
          read: true,
          create: false,
          edit: false,
          delete: false
        }
      };

      callback(null, userPermissions);
    };

    server.register({
      register: require('hapi-route-acl'),
      options: {
        permissionsFunc: permissionsFunc
      }
    }, function(err) {
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
    const AuthBearer = require('hapi-auth-bearer-token');

    server.register(AuthBearer, (err) => {
      if (err) {
        reject();
      } else {
        console.log(' -= server.auth.strategy');
        server.auth.strategy('simple', 'bearer-access-token', {
          accessTokenName: 'X-CART-Token',    // optional, 'access_token' by default
          validateFunc: function (token, callback) {
            console.log(' -= token');
            console.log(token);

            // For convenience, the request object can be accessed
            // from `this` within validateFunc.
            var request = this;

            DAL.users.getUserByToken(token, function (user) {
              console.log(' -= user');
              console.log(user);
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