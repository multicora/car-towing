'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 2,
  message: 'Add \'property-manager\'',
  script: function (next) {
    DAL.roles.create({
      name: "property-manager"
    }, next);
  },
};