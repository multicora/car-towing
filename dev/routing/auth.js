'use strict';

const path = require('path');
const Boom = require('boom');
const DAL = require('../dal/dal.js');
const Utils = require('../services/utils.js');
const Joi = require('joi');
const passwordHash = require('password-hash');
const resetPasswordService = require('../services/resetPassword.js');

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
    path: '/api/reset_password',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().min(3).max(255).required(),
        }
      },
      handler: function (request, reply) {
        resetPasswordService.resetPassword(request.payload.email).then((res) => {
          reply (res);
        }, (err) => {
          reply (Boom.badImplementation('Server error', err));
        });
      }
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
        DAL.users.getUserForLogin(user.login, (err, doc) => {
          if (!!doc && passwordHash.verify(user.password, doc.password)) {
              let token = Utils.newToken();
              DAL.users.updateToken(token, user.login, (err, user) => {
                if (user) {
                  user.token = token;
                  reply(user);
                } else {
                  reply(Boom.badImplementation('Server error'));
                }
              });
          } else {
            reply(Boom.unauthorized('The username or password is incorrect'));
          }
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/currentUser',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        reply(request.auth.credentials);
      }
    }
  });
};