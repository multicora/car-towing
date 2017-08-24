// TODO: check max size
// TODO: check extension

'use strict';

const files = require('../services/files.js')();
const DAL = require('../dal/dal.js');
const Boom = require('boom');
const path = require('path');
const Promise = require('promise');

module.exports = function (server) {
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
      handler: (request, reply) => {
        DAL.files.getByPropertyId(request.params.propId).then(
          fileDataArray => reply(fileDataArray)
        ).catch(
          err => reply(Boom.badImplementation(err, err))
        );
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