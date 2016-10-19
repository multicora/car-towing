'use strict';

const DAL = require('../dal/dal.js');
const Boom = require('boom');

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/api/complaint',
    handler: function (request, reply) {
      var err = Boom.notImplemented('Not implemented yet!');
      reply(err.message);
    }
  });
};