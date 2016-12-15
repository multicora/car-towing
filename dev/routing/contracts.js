'use strict';

const DAL = require('../dal/dal.js');
const Boom = require('boom');

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/api/contract',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['contracts:edit']
        }
      },
      handler: function (request, reply) {

        DAL.contract.create({
          property: request.payload.property,
          term: request.payload.term,
          notifyTerm: request.payload.notifyTerm,
          activationDate: new Date,
          activationAuthor: request.auth.credentials._id
        }, function (err, res) {
          !err ? reply(res) : reply( Boom.badImplementation(err) );
        });

      }
    }
  });
};