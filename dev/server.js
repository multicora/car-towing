'use strict';

// External
const Hapi = require('hapi');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');

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