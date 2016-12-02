'use strict';

const Mongoose = require('mongoose');
const DAL = require('../dal/dal.js');
const Utils = require('../services/utils.js');
const Transaction = require('mongoose-transaction')(Mongoose);
const path = require('path');
const Boom = require('boom');
const Joi = require('joi');

module.exports = function (server) {

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
    path: '/api/user-property/{userId}',
    handler: function (request, reply) {
      DAL.properties.getByUserId(request.params.userId, function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/api/property/{id}',
    config: {
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
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['properties:create']
        }
      },
      validate: {
        payload: {
          name: Joi.string().min(1).max(255).required(),
          address: Joi.string(),
          logo: Joi.string(),
          location: Joi.string(),
          rules: Joi.array().items(Joi.string()),
          login: Joi.string().email()
        }
      },
      handler: function handler(request, reply) {
        const createOrGetUser = (newUser, cb) => {
          DAL.users.getUserByEmail(newUser.email, function (err, user) {
            if (!user) {
              DAL.users.createUser(newUser, cb);
            } else {
              cb(null, user);
            }
          });
        };
        let generateSetPasswordLink = (token) => {
          let route = Utils.getSetPassRoute();
          return [route, token].join('');
        }

        DAL.roles.getByName(Utils.rolesNames.propertyManager, function(err, role) {
          let newUser = {
            email: request.payload.login,
            resetToken: Utils.newToken(),
            roles: [role._id]
          };

          createOrGetUser(newUser, function (err, user) {
            let newProperty = request.payload;

            newProperty.manager = user._id;
            DAL.properties.create(newProperty, function (err, property) {
              console.log(property);
              !err ? reply( generateSetPasswordLink(user.resetToken) ) : reply( Boom.badRequest(err) );
            });
          });
        });
      }
    }
  });

  /*Content-Type: application/x-www-form-urlencoded*/
  server.route({
    method: 'PUT',
    path: '/api/property/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['properties:edit']
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
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['properties:delete']
        }
      },
      handler: function (request, reply) {
        DAL.properties.remove(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/towingMatrix/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['properties:edit']
        }
      },
      handler: function (request, reply) {
        DAL.properties.edit(request.params.id, request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
};