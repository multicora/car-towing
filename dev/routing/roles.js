'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');

module.exports = function (server) {
  // TODO: for debugging
  // server.route({
  //   method: 'GET',
  //   path: '/api/roles',
  //   handler: function (request, reply) {
  //     DAL.roles.get(function (err, docs) {
  //       !err ? reply(docs) : reply(JSON.stringify(err));
  //     });
  //   }
  // });
};