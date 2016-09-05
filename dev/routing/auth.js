'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
const Boom = require('boom');

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/api/new_password',
    handler: function (request, reply) {
      DAL.users.resetPassword(request.payload, function (err, docs) {
        !err ? reply(docs) : reply(Boom.badRequest(err));
      });
    }
  });
};