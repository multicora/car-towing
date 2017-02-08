'use strict';

const DAL = require('../dal/dal.js');
const Utils = require('../services/utils.js');
const path = require('path');
const Boom = require('boom');
const Joi = require('joi');
const propertyService = require('../services/propertyService.js');
const propertyCtrl = require('../controllers/propertiesCtrl.js');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/api/properties',
    handler: function (request, reply) {
      DAL.properties.getExisting(function (err, docs) {
        !err ? reply(docs) : reply(Boom.badImplementation(err));
      });
    }
  });

  // GET /api/user-property/{userId}
  server.route({
    method: 'GET',
    path: '/api/user-property/{userId}',
    handler: function (request, reply) {
      DAL.properties.getByUserId(request.params.userId, function (err, res) {
        if (err) {
          reply( Boom.badImplementation(err) )
        } else if (!res) {
          reply( Boom.notFound('Property not found', 'Property not found') );
        } else {
          reply(res);
        }
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/api/property/{id}',
    config: {
      handler: function (request, reply) {
        DAL.properties.getById(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(Boom.badImplementation(err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/properties-by-location/{id}',
    config: {
      handler: function (request, reply) {
        DAL.properties.getByLocation(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(Boom.badImplementation(err));
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
        let userExist = false;
        const serverUrl = request.headers.header;
        const createOrGetUser = (newUser, cb) => {
          DAL.users.getUserByEmail(newUser.email, function (err, user) {
            if (!user) {
              DAL.users.createUser(newUser, cb);
            } else {
              userExist = true;
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

              !err ? reply( propertyService.sendConfirmMail(user.email, generateSetPasswordLink(user.resetToken), serverUrl , userExist) ) : reply( Boom.badRequest(err) );
            });
          });
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/new_manager',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['properties:create']
        }
      },
      handler: function handler(request, reply) {
        const propertyId = request.payload.propertyId;
        const managerEmail = request.payload.email;
        const serverUrl = request.headers.header;
        let userExist = false;

        const createOrGetUser = (newUser, cb) => {
          DAL.users.getUserByEmail(newUser.email, function (err, user) {
            if (!user) {
              DAL.users.createUser(newUser, cb);
            } else {
              userExist = true;
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
            email: managerEmail,
            resetToken: Utils.newToken(),
            roles: [role._id]
          };

          createOrGetUser(newUser, function (err, user) {
            DAL.properties.newManager(propertyId, user._id, function (err, property) {
              console.log(user.email, generateSetPasswordLink(user.resetToken), serverUrl);
              !err ? reply( propertyService.sendConfirmMail(user.email, generateSetPasswordLink(user.resetToken), serverUrl, userExist) ) : reply( Boom.badRequest(err) );
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
          !err ? reply(docs) : reply(Boom.badImplementation(err));
        });
      }
    }
  });

  // DELETE /api/property/{id}
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
        DAL.properties.delete(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(Boom.badImplementation(err));
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
          if (!err) {
            propertyCtrl.sendMatrixChangeNotifications(request.params.id).then(function () {
              reply(docs)
            });
          } else {
            reply(Boom.badRequest(err));
          }
        });
      }
    }
  });
};