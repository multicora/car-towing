'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 3,
  message: 'Add \'admin\' role',
  script: function (next) {
    DAL.roles.create({
      name: 'admin'
    }, next);
  },
};