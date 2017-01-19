'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/api/blocking/{propertyId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['blocking:read']
        }
      },
      handler: function (request, reply) {
        DAL.blocking.getByPropId(request.params.propertyId, function (err, docs) {
          console.log(docs);
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/blocking/{propertyId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['blocking:create']
        }
      },
      handler: function (request, reply) {
        DAL.blocking.create(request.params.propertyId, request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
  server.route({
    method: 'DELETE',
    path: '/api/unblocking/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['blocking:create']
        }
      },
      handler: function (request, reply) {
        DAL.blocking.remove(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
};