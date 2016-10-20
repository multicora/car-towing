'use strict';

const DAL = require('./../../dal/dal.js');
const passwordHash = require('password-hash');

module.exports = {
  version: 12,
  message: 'Hashing password for users.',
  script: (next) => {
    DAL.users.getAllUsersWithPassword((err, resp) => {
      let length = resp.length;
      let i = 0;
      for(; i < length; i++) {
        if (resp[i].password && !passwordHash.isHashed(resp[i].password)) {
          resp[i].password = passwordHash.generate(resp[i].password);
          DAL.users.updateUser(resp[i]._id, resp[i], next);
        } else {
          next;
        }
      }
    });
  },
};