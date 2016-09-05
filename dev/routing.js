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

  // Properties
  server.route({
    method: 'GET',
    path: '/api/properties',
    handler: function (request, reply) {
      DAL.properties.get(function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });
  server.route({
    method: 'GET',
    path: '/api/property/{id}',
    config: {
      pre: [
        { method: 'checkTokin(raw.req.headers.token)', assign: "token" }
      ],
      handler: function (request, reply) {
        DAL.properties.getById(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/property',
    config: {
      validate: {
        params: {
          name: Joi.string().min(1).max(255).required(),
          address: Joi.string(),
          logo: Joi.string(),
          rules: Joi.array().items(Joi.string())
        }
      },
      handler: function (request, reply) {
        DAL.properties.create(request.payload, function (err, docs) {
          !err ? reply('Done') : reply(JSON.stringify(err));
        });
      }
    }
  });

  /*Content-Type: application/x-www-form-urlencoded*/
  server.route({
    method: 'PUT',
    path: '/api/property/{id}',
    config: {
      validate: {
        params: {
          name: Joi.string().min(1).max(255).required(),
          address: Joi.string(),
          objId: Joi.string(),
          logo: Joi.string(),
          rules: Joi.array().items(Joi.string())
        }
      },
      handler: function (request, reply) {
        DAL.properties.edit(request.params.id, request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/property/{id}',
    handler: function (request, reply) {
      DAL.properties.remove(request.params.id, function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
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

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, './public')
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/new_password/{resetToken}',
    handler: function (request, reply) {
      DAL.users.resetPassword(request.params.resetToken, request.payload, function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });
};