'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 1,
  message: 'Add towed page',
  script: function (next) {
    DAL.customPages.create({
      key: 'got-towed',
      name: 'Got towed page'
    }, next);
  },
};