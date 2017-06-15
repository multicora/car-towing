'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 15,
  message: 'Add "see-photos-page" action to property manager role',
  script: function (next) {
    DAL.roles.getByName('property-manager', function (err, role) {
      DAL.actions.getByName('see-photos-page', function (err, action) {
        role.actions.push(action._id);
        DAL.roles.update(role._id, role, next);
      });
    });
  },
};