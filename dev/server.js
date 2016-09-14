'use strict';

// External
const Hapi = require('hapi');
const mongoose = require('mongoose');
const _ = require('lodash');

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

function registerLoging(server, cb) {
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
  }, cb);
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
  server.connection( {port: 3000, routes: {cors: {origin: ['*'],credentials : true}}} );

  const cbBinded = _.bind(
    function (server, err) {
      if (err) throw err
      const auth = require('./auth.js');
      const routing = require('./routing');
      auth.init(server);
      routing.init(server);
    },
    null,
    server
  );
  registerStaticFilesServer(server, cbBinded);

  const registerLogCb = _.bind(
    (server, err) => {
      if (err) throw err; // something bad happened loading the plugin

      server.start((err) => {
        if (err) throw err;
        configureServer(server);
        server.log('info', 'Server running at: ' + server.info.uri);
      });
    },
    null,
    server
  );
  registerLoging(server, registerLogCb);
}