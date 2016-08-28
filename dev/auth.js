// TODO: change 'token' to 'X-CART-Token'

'use strict';

const DAL = require('./dal/dal.js');
const Boom = require('boom');

module.exports = {
  init: function (server) {
    server.method('checkTokin', (token, next) => {
      DAL.users.checkToken(token, (err, docs) => {
        // TODO: remove hardcode
        // !!err ? next() : next(Boom.unauthorized('invalid token'));
        token === '1234' ? next() : next(Boom.unauthorized('invalid token'));
      });
    });
  },
  // TODO: what is it?
  create: (cb) => {
    DAL.users.createUser('vadim@v.ua', 'ps121212', "token1234", cb);
  },
  login: (user, cb) => {
    DAL.users.getUserByEmail(user.login, (err, docs) => {
      if (!!docs && docs.password == user.password) {
          let token = newToken();
          DAL.users.updateToken(token, user.login, (err, docs) => {
            !!docs ? cb({"X-CART-Token": docs.token}) : cb(Boom.badImplementation('Server error'));          
          });
      } else {
        cb(Boom.unauthorized('The username or password is incorrect'));
      }
    }); 
  }
};

function newToken() {
  const RandToken = require('rand-token');
  return RandToken.generate(16);
}