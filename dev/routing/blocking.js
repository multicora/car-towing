'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
const Boom = require('boom');
const towingBlockingService = require('../services/towingBlockingService.js');
const blockingCtrl = require('../controllers/blockingCtrl.js');

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
    method: 'GET',
    path: '/api/blocking/status/{propertyId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['blocking:read']
        }
      },
      handler: function (request, reply) {
        try {
          blockingCtrl.getStatus(request.params.propertyId).then((status) => {
            reply(status);
          }).catch((err) => {
            console.error(err);
          });
        } catch(err) {
          console.error(err);
        }
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
        DAL.blocking.create(request.params.propertyId, request.payload, 
        function (err, docs) {
          DAL.properties.getById(request.params.propertyId, (err, property) => {
            if(!err) {
              towingBlockingService.sendNotification(
                request.params.propertyId, property.name,
                request.auth.credentials.email
              ).then((success) => {
                reply(success);
              });
            } else {
              reply(Boom.badImplementation(err));
            }
          });
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
          permissions: ['blocking:edit']
        }
      },
      handler: function (request, reply) {
        DAL.blocking.remove(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
  server.route({
    method: 'PUT',
    path: '/api/blocking/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['blocking:edit']
        }
      },
      handler: function (request, reply) {
        DAL.blocking.edit(request.params.id, request.payload, function (err, docs) {
          !err ? reply(docs) : reply(Boom.badRequest(err));
        });
      }
    }
  });
};