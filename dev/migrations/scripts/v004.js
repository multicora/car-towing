'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 4,
  message: 'Add admin',
  script: function (next) {
    DAL.roles.getByName('admin', function (err, adminRole) {
      DAL.users.createUser({
        email: 'admin@admin.com',
        password: 'admin',
        roles: adminRole._id
      }, next);
    });
  },
};