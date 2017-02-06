'use strict';

const DAL = require('../dal/dal.js');
const Boom = require('boom');
const contractsTimeCalculate = require('../services/contractsTimeCalculate.js')();

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
          activationDate: request.payload.activationDate,
          activationAuthor: request.auth.credentials._id
        }, function (err, res) {
          !err ? reply(res) : reply( Boom.badImplementation(err) );
        });

      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/check-contract/{propertyId}',
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
          if (err) {
            return reply( Boom.badImplementation(err) );
          }

          let now = new Date();
          let validContracts = res.map(function (contract) {
            let activationDate = new Date(contract.activationDate);
            return new Date(activationDate.getTime() + contract.term);
          }).filter(function (contract) {
            return contract > now;
          });

          reply( (validContracts.length > 0) ? true : false );
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

  server.route({
    method: 'GET',
    path: '/api/contracts/{propertyId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['contracts:read']
        }
      },
      handler: function (request, reply) {

        DAL.contract.getByPropId(request.params.propertyId, function (err, res) {
          !err ? reply(res) : reply( Boom.badImplementation(err) );
        });

      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/contracts-time/{propertyId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['contracts:read']
        }
      },
      handler: function (request, reply) {

        DAL.contract.getByPropId(request.params.propertyId, function (err, res) {
          !err ? reply(contractsTimeCalculate.calculate(res)) : reply( Boom.badImplementation(err) );
        });

      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/contract/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['contracts:delete']
        }
      },
      handler: function (request, reply) {
        DAL.contract.remove(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(Boom.badImplementation(err));
        });
      }
    }
  });
};