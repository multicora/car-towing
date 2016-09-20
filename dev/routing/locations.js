'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
const Boom = require('boom');
const Joi = require('joi');

module.exports = (server) => {

  server.route({
    method: 'POST',
    path: '/api/locations',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['locations:create']
        }
      },
      handler:(request, reply) => {
        DAL.locations.create(request.payload, (err, docs) => {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/locations',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['locations:read']
        }
      },
      handler:(request, reply) => {
        DAL.locations.get((err, docs) => {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/locations/{locationId}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['locations:read']
        }
      },
      handler:(request, reply) => {
        DAL.locations.getById(request.params.locationId, (err, docs) => {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
};