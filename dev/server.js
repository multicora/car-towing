'use strict';

// External
const Hapi = require('hapi');
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost/carTowing');

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

function startServer() {
  const server = new Hapi.Server();
  server.connection({ port: 3000 });

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
        server.log('info', 'Server running at: ' + server.info.uri);
      });
    },
    null,
    server
  );
  registerLoging(server, registerLogCb);
}