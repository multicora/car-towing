'use strict';

const path = require('path');
const DAL = require('../dal/dal.js');
const Boom = require('boom');
const Joi = require('joi');

module.exports = function (server) {

  server.route({
    method: 'POST',
    path: '/api/users',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:create']
        }
      },
      handler: function (request, reply) {
        DAL.users.createUser(request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/drivers',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:create']
        }
      },
      handler: function (request, reply) {
        let user = request.payload;
        DAL.roles.getByName('driver', function (err, role) {
          user.roles = [];
          user.roles.push(role._id);
          DAL.users.createUser(request.payload, function (err, docs) {
            !err ? reply(docs) : reply(JSON.stringify(err));
          });
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/users',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:read']
        }
      },
      handler: function (request, reply) {
        DAL.users.get(function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/drivers',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:read']
        }
      },
      handler: function (request, reply) {
        let driversArr = [];

        DAL.users.get(function (err, usersArr) {
          DAL.roles.getByName('driver', function (err, role) {

            usersArr.map(function(user) {
              if (user.roles.indexOf(role._id) >= 0) {
                driversArr.push(user);
              }
            });

            !err ? reply(driversArr) : reply(JSON.stringify(err));
          })
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/users/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:read']
        }
      },
      handler: function (request, reply) {
        DAL.users.getUserById(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/users/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:write']
        }
      },
      handler: function (request, reply) {
        DAL.users.updateUser(request.params.id, request.payload, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'get',
    path: '/api/user-block/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:write']
        }
      },
      handler: function (request, reply) {
        DAL.users.blockUser(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });

  server.route({
    method: 'get',
    path: '/api/user-unblock/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:write']
        }
      },
      handler: function (request, reply) {
        DAL.users.unBlockUser(request.params.id, function (err, docs) {
          !err ? reply(docs) : reply(JSON.stringify(err));
        });
      }
    }
  });
};