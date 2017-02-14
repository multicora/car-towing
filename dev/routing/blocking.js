'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
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
};