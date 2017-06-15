// TODO: check max size
// TODO: check extension

'use strict';

const files = require('../services/files.js')();
const DAL = require('../dal/dal.js');
const Boom = require('boom');
const path = require('path');
const Promise = require('promise');

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
            DAL.files.save(
              fileId,
              request.auth.credentials._id,
              request.payload.propertyId,
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
            reply(err);
          }
        });
      }
    }
  });

  // GET: /api/files/{propId}
  server.route({
    method: 'GET',
    path: '/api/files/{propId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['files:read']
        }
      },
      handler: function (request, reply) {
        DAL.files.getByPropertyId(request.params.propId, function (err, fileDataArray) {
          const filesPromises = fileDataArray.map(function (fileData) {
            return files.getFile(fileData.fileId);
          });

          Promise.all(filesPromises).then(
            (res) => {
              res = res.map( (url, index) => {
                return {
                  url: url,
                  ownerId: fileDataArray[index].ownerId,
                  updated: fileDataArray[index].updated
                }
              }).filter( item => !!item);

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

  server.route({
    method: 'GET',
    path: '/uploads/{fileName*}',
    config: {
      handler: function (request, reply) {
        const pathExists = require('path-exists');

        let filePath = path.resolve(__dirname, './../../uploads/') + '/' + request.params.fileName;

        pathExists(filePath).then(exists => {
          if (exists) {
            reply.file(filePath);
          } else {
            filePath = path.resolve(__dirname, './../uploads/') + '/' + request.params.fileName;
            reply.file(filePath);
          }
        });
      }
    }
  });
};