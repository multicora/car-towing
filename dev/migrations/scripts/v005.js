'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 5,
  message: 'Add \'driver\' role',
  script: function (next) {
    DAL.roles.create({
      name: 'driver'
    }, next);
  },
};