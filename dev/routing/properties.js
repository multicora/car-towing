'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
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
      validate: {
        payload: {
          name: Joi.string().min(1).max(255).required(),
          address: Joi.string(),
          logo: Joi.string(),
          location: Joi.string(),
          blocked: Joi.boolean()
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
};