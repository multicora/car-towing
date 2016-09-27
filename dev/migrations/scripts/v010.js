'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 10,
  message: 'Add admin role action',
  script: function (next) {
    DAL.roles.getByName('admin', function (err, adminRole) {
      DAL.actions.getByName('see-admin-page', function (err, adminActions) {
        DAL.roles.update(adminRole._id, {
          actions: adminActions._id
        }, next);
      });
    });
  },
};