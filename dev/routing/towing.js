'use strict';

const DAL = require('../dal/dal.js');
const Boom = require('boom');
const files = require('../services/files.js')();

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/api/emergency-towing',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['towing:create']
        }
      },
      handler: (request, reply) => {
        DAL.files.save(
          request.auth.credentials._id,
          request.payload.propertyId,
          request.payload.datetime || new Date(),
          request.payload.fileData
        ).then(res => DAL.emergencyTow.create(
          request.payload.propertyName,
          res._id,
          request.payload.location
        )).then(
          res => reply(res)
        ).catch(
          err => reply(Boom.badImplementation(err))
        );
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/towing',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['towing:create']
        }
      },
      payload: {
        maxBytes: 2e+7, // 20Mb
      },
      handler: (request, reply) => {
        DAL.files.save(
          request.auth.credentials._id,
          request.payload.propertyId,
          request.payload.datetime || new Date(),
          request.payload.fileData
        ).then(
          res => reply(res)
        ).catch(
          err => reply(Boom.badImplementation(err, err))
        );
      }
    }
  });
};