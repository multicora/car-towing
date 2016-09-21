'use strict';

const path = require('path');
const Boom = require('boom');
const DAL = require('../dal/dal.js');
const Utils = require('../services/utils.js');
const Joi = require('joi');

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/api/new_password',
    handler: function (request, reply) {
      DAL.users.resetPassword(request.payload, function (err, docs) {
        !err ? reply(docs) : reply(Boom.badRequest(err));
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/login',
    config: {
      validate: {
        payload: {
          login: Joi.string().email().min(3).max(255).required(),
          password: Joi.string().required()
        }
      },
      handler: function (request, reply) {
        const user = request.payload;
        DAL.users.getUserByEmail(user.login, (err, docs) => {
          if (!!docs && docs.password == user.password) {
              let token = Utils.newToken();
              DAL.users.updateToken(token, user.login, (err, user) => {
                !!user ? reply(user) : reply(Boom.badImplementation('Server error'));
              });
          } else {
            reply(Boom.unauthorized('The username or password is incorrect'));
          }
        });
      }
    }
  });
};