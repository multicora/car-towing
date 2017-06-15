'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 11,
  message: 'Add property manager role action',
  script: function (next) {
    DAL.roles.getByName('property-manager', function (err, managerRole) {
      DAL.actions.getByName('see-manager-page', function (err, managerActions) {
        DAL.roles.update(managerRole._id, {
          actions: managerActions._id
        }, next);
      });
    });
  },
};