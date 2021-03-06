'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');

module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/api/visitorsCounter',
    handler: function (request, reply) {
      DAL.settings.getByName('visitorsCounter', function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });
  server.route({
    method: 'PUT',
    path: '/api/settings',
    handler: function (request, reply) {
      DAL.settings.update(request.payload, function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });
};