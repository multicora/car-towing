'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/api/parkingRules',
    handler: function (request, reply) {
      DAL.parkingRules.getAll(function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/api/parkingRules/{propertyId}',
    config: { 
      pre: [
        { method: 'checkTokin(raw.req.headers.token)', assign: "token" }
      ],
      handler: function (request, reply) {
        DAL.parkingRules.getByPropId(request.params.propertyId, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/parkingRules/{propertyId}',
    handler: function (request, reply) {
      if (Object.prototype.toString.call(request.payload) === '[object Array]') {
        DAL.parkingRules.setByPropId(request.params.propertyId, request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      } else {
        DAL.parkingRules.create(request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/parkingRules/{id}',
    handler: function (request, reply) {
      DAL.parkingRules.update(request.params.id, request.payload, function (err, docs) {
        !err ? reply('Done') : reply(JSON.stringify(err));
      });
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/parkingRules/{id}',
    handler: function (request, reply) {
      DAL.parkingRules.remove(request.params.id, function (err, docs) {
        !err ? reply('Done') : reply(JSON.stringify(err));
      });
    }
  });
};