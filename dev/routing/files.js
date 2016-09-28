// TODO: check max size
// TODO: check extension

'use strict';

const files = require('../services/files.js')();
const DAL = require('../dal/dal.js');
const Boom = require('boom');

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/api/file',
    config: {

      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },

      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['files:create']
        }
      },

      handler: function (request, reply) {
        files.setFile(request, function (err, fileId) {
          if (!err) {
            DAL.files.save(fileId, request.auth.credentials._id, request.payload.propertyId, function (err, res) {
              if (err) {
                files.removeFile(fileId, function () {
                  reply( Boom.badImplementation('Error while saving file', err) )
                });
              } else {
                reply(res);
              }
            });
          } else {
            reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/files/{ownerId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['files:read']
        }
      },
      handler: function (request, reply) {
        DAL.files.getByOwnerId(request.params.ownerId, function (err, res) {
          const filesPromises = res.map(function (fileData) {
            return files.getFile(fileData.fileId);
          });

          Promise.all().then(
            (res) => {
              reply(res);
            },
            (err) => {
              reply(Boom.badImplementation('Error while getting files', err))
            }
          );
        });
      }
    }
  });
};