'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 14,
  message: 'Add "see-photos-page" action',
  script: function (next) {
    DAL.actions.createAction({
      name: 'see-photos-page'
    }, next);
  },
};