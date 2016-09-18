// TODO: separate static url frpm API

'use strict';

const path = require('path');
const DAL = require('./dal/dal.js');
const Joi = require('joi');
const files = require('./routing/files.js');
const Boom = require('boom');

module.exports.init = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/index.html') );
    }
  });
  server.route({
    method: 'GET',
    path: '/dummy',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/dummy.html') );
    }
  });
  server.route({
    method: 'GET',
    path: '/1',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/1.png') );
    }
  });
  server.route({
    method: 'GET',
    path: '/name-{name}',
    handler: function (request, reply) {
      reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
  });

  server.route({
    method: 'POST',
    path: '/api/gotTowed',
    handler: function (request, reply) {
      DAL.customPages.update(request.payload, function (err, doc) {
        if (!err && doc) {
          reply(doc);
        } else {
          reply(JSON.stringify(err));
        }
      });
    }
  });

  files(server);

  // Blocking
  require('./routing/blocking.js')(server);
  require('./routing/parkingRules.js')(server);
  require('./routing/auth.js')(server);
  require('./routing/property.js')(server);
  require('./routing/users.js')(server);
  require('./routing/customPage.js')(server);

  // For debugging
  //require('./routing/roles.js')(server);

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, './public')
      }
    }
  });
};