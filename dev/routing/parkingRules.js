'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
const Boom = require('boom');

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/api/parkingRules/{propertyId}',
    config: {
      handler: function (request, reply) {
        DAL.parkingRules.getByPropId(request.params.propertyId, function (err, docs) {
          !err ? reply(docs) : reply(Boom.badRequest(err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/parkingRules/{propertyId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['parkingRules:create']
        }
      },
      handler: function (request, reply) {
        const data = request.payload;

        data.propertyId = request.params.propertyId;

        // TODO: move checking to utils
        if (Object.prototype.toString.call(request.payload) === '[object Array]') {
          DAL.parkingRules.setByPropId(request.params.propertyId, request.payload, function (err, docs) {
            !err ? reply(docs) : reply(Boom.badRequest(err));
          });
        } else {
          DAL.parkingRules.create(data, function (err, docs) {
            !err ? reply(docs) : reply(Boom.badRequest(err));
          });
        }
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/parkingRules/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['parkingRules:edit']
        }
      },
      handler: function (request, reply) {
        DAL.parkingRules.update(request.params.id, request.payload, function (err, docs) {
          !err ? reply('Done') : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/parkingRules/{id}',config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['parkingRules:delete']
        }
      },
      handler: function (request, reply) {
        DAL.parkingRules.remove(request.params.id, function (err, docs) {
          !err ? reply('Done') : reply(JSON.stringify(err));
        });
      }
    }
  });
};