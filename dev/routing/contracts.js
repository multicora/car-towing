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

  server.route({
    method: 'GET',
    path: '/api/contract-by-propety/{propertyId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['contracts:read']
        }
      },
      handler: function (request, reply) {

        const propId = request.params.propertyId;
        DAL.contract.getByPropId(propId, function (err, res) {
          !err ? reply(res).code( res ? 200 : 404) : reply( Boom.badImplementation(err) );
        });

      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/contracts',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['contracts:read']
        }
      },
      handler: function (request, reply) {

        DAL.contract.get(function (err, res) {
          !err ? reply(res) : reply( Boom.badImplementation(err) );
        });

      }
    }
  });
};