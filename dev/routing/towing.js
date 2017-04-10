'use strict';

const DAL = require('../dal/dal.js');
const Boom = require('boom');
const files = require('../services/files.js')();

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/api/emergencyTow',
    handler: function (request, reply) {
      DAL.emergencyTow.get(function (err, docs) {
        !err ? reply(docs) : reply(Boom.badImplementation(err));
      });
    }
  });

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
      handler:(request, reply) => {
        files.saveFromBase64(request.payload.fileData, 'jpg', function (err, fileId) {
          if (!err) {
            DAL.files.save(fileId, request.auth.credentials._id, request.payload.propertyId, function (err, res) {
              if (err) {
                files.removeFile(fileId, function () {
                  reply( Boom.badImplementation('Error while saving file', err) )
                });
              } else {
                DAL.emergencyTow.create(request.payload.propertyName, res._id, request.payload.location, function (err) {
                  err ? reply(Boom.badImplementation(err)) : reply(res);
                });
              }
            });
          } else {
            reply(Boom.badImplementation(err));
          }
        });
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
      handler:(request, reply) => {
        files.saveFromBase64(request.payload.fileData, 'jpg', function (err, fileId) {
          if (!err) {
            DAL.files.save(
              fileId,
              request.auth.credentials._id,
              request.payload.propertyId,
              request.payload.datetime || new Date(),
              function (err, res) {
                if (err) {
                  files.removeFile(fileId, function () {
                    reply( Boom.badImplementation('Error while saving file', err) )
                  });
                } else {
                  reply(res);
                }
              }
            );
          } else {
            reply(Boom.badImplementation(err));
          }
        });
      }
    }
  });
};