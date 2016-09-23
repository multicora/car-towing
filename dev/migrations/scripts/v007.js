'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 7,
  message: 'Add parking problem page',
  script: function (next) {
    DAL.customPages.create({
      key: 'parking-problem',
      name: 'Parking problem page'
    }, next);
  },
};