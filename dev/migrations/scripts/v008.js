'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 8,
  message: 'Add admin action',
  script: function (next) {
    DAL.actions.createAction({
      name: 'see-admin-page'
    }, next);
  },
};