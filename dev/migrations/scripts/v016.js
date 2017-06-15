'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 16,
  message: 'Add "see-photos-page" action to admin role',
  script: function (next) {
    DAL.roles.getByName('admin', function (err, role) {
      DAL.actions.getByName('see-photos-page', function (err, action) {
        role.actions.push(action._id);
        DAL.roles.update(role._id, role, next);
      });
    });
  },
};