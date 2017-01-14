'use strict';

const DAL = require('../dal/dal.js');
const Boom = require('boom');

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
    path: '/api/emergencyTow',
    handler: function (request, reply) {
      // DAL.emergencyTow.create(function (err, docs) {
      //   !err ? reply(docs) : reply(Boom.badImplementation(err));
      // });
      reply();
    }
  });
};