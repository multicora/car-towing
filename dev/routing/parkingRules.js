'use strict';

const path = require('path');
const DAL = require('./dal/dal.js');

module.exports.init = function (server) {
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
      DAL.parkingRules.setByPropId(request.params.propertyId, request.payload, function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/parkingRules/',
    handler: function (request, reply) {
      DAL.parkingRules.setByPropId(request.payload, function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
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