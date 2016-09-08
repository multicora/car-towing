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
      // TODO: uncomment validations
      // validate: {
      //   payload: {
      //     name: Joi.string().min(1).max(255).required(),
      //     address: Joi.string(),
      //     logo: Joi.string(),
      //     rules: Joi.array().items(Joi.string())
      //   }
      // },
      handler: function (request, reply) {
        let runTransaction = (roleId) => {
          let transaction = new Transaction();
          let newUser = {
            email: request.payload.login,
            resetToken: Utils.newToken(),
            roles: [roleId]
          };

          transaction.insert(path.basename(module.filename, '.js'), request.payload);
          // TODO: rewrite for getting users model name
          transaction.insert('users', newUser);

          // TODO: add error log? replace transaction library?
          transaction.run(function(err, docs){
            docs ? reply(docs) : reply(JSON.stringify("something goes wrong"));
          });
        };

        DAL.roles.getByName(Utils.rolesNames.propertyManager, function(err, docs) {
          !err ? runTransaction(docs._id): reply(JSON.stringify(err));
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
};