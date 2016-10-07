'use strict';

const Mongoose = require('mongoose');
const DAL = require('../dal/dal.js');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/api/decal',
    handler: function (request, reply) {
      DAL.decal.get(function (err, docs) {
        !err ? reply(docs) : reply(JSON.stringify(err));
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/api/decal/{id}',
    config: {
      handler: function (request, reply) {
        DAL.decal.getById(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/decal',
    config: {
      // auth: 'simple',
      // plugins: {
      //   hapiRouteAcl: {
      //     permissions: ['decal:create']
      //   }
      // },
      handler: function (request, reply) {
        DAL.decal.create(request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/decal/{id}',
    config: {
      // auth: 'simple',
      // plugins: {
      //   hapiRouteAcl: {
      //     permissions: ['decal:edit']
      //   }
      // },
      handler: function (request, reply) {
        DAL.decal.edit(request.params.id, request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/decal/{id}',
    config: {
      // auth: 'simple',
      // plugins: {
      //   hapiRouteAcl: {
      //     permissions: ['decal:remove']
      //   }
      // },
      handler: function (request, reply) {
        DAL.decal.remove(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
};