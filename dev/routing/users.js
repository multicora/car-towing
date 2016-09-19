'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
const Boom = require('boom');
const Joi = require('joi');

module.exports = function (server) {

  server.route({
    method: 'POST',
    path: '/api/users',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:create']
        }
      },
      handler: function (request, reply) {
        DAL.users.createUser(request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/users',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:read']
        }
      },
      handler: function (request, reply) {
        DAL.users.get(function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/users/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:read']
        }
      },
      handler: function (request, reply) {
        DAL.users.getUsersById(function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
};