// TODO: separate static url frpm API

'use strict';

const path = require('path');
const DAL = require('./dal/dal.js');
const Joi = require('joi');
const files = require('./routing/files.js');
const Boom = require('boom');
const Utils = require('./services/utils.js');

module.exports.init = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file( path.resolve(__dirname, './public/index.html') );
    },
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
    method: 'GET',
    path: '/test',
    handler: function (request, reply) {
      DAL.properties.get(function (err, docs) {
        reply('Docs: ' + JSON.stringify(docs));
      });
    }
  });
  server.route({
    method: 'GET',
    path: '/testcreate',
    handler: function (request, reply) {
      DAL.properties.create({name: 'testName'}, function (err, docs) {
        !err ? reply('Done') : reply('Error:');
      });
    }
  });

  // Custom pages
  server.route({
    method: 'GET',
    path: '/gotTowedEdit',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/gotTowed/markupEdit.html') );
    }
  });

  server.route({
    method: 'GET',
    path: '/gotTowed',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/gotTowed/markup.html') );
    }
  });

  server.route({
    method: 'GET',
    path: '/api/gotTowed',
    handler: function (request, reply) {
      DAL.customPages.getByKey('got-towed', function (err, docs) {
        !err ? reply(docs) : reply('Error: ' + err);
      });
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

  server.route({
    method: 'POST',
    path: '/api/login',
    handler: function (request, reply) {
      const Auth = require('./auth.js');
      Auth.login(request.payload, (response) => {
        reply(response);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/create',
    handler: function (request, reply) {
      const Auth = require('./auth.js');
      Auth.create((err, docs) => {
        reply(docs);
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
  require('./routing/settings.js')(server);

  server.route({
    method: 'GET',
    path: '/{param*}',
    config: {
      state: {
        parse: true,
        failAction: 'log'
      },
      handler:  function (request, reply) {
        // TODO: move to separate function
        // visitor counter functionality
        let newToken = Utils.newToken();
        if (!request.state.session && request.raw.req.url.endsWith('.html')) {
          // TODO: replace with redis solution
          DAL.settings.getByName('visitorsCounter', (err, docs) => {
            if (!err) {
              let visitorCount = docs && (+docs.value) || 0;
              DAL.settings.update({name: 'visitorsCounter', value: visitorCount+1}, (err, docs) => {});
            }
          });
          let session = { Token: Utils.newToken() };
          reply.file( path.resolve(__dirname, './public/' + request.params.param ) ).state('session', session);
        } else {
          reply.file( path.resolve(__dirname, './public/' + request.params.param ) );
        }
      }
    }
  });
};