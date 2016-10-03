'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 9,
  message: 'Add manager action',
  script: function (next) {
    DAL.actions.createAction({
      name: 'see-manager-page'
    }, next);
  },
};