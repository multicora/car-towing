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
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/blocking',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['blocking:create']
        }
      },
      handler: function (request, reply) {
        DAL.blocking.create(request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
};