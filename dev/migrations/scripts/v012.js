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
      let promiseArr = [];

      for(; i < length; i++) {
        if (resp[i].password && !passwordHash.isHashed(resp[i].password)) {
          resp[i].password = passwordHash.generate(resp[i].password);
          promiseArr.push(modifyUser(resp[i]));
        }
      }

      Promise.all(promiseArr).then(function () {
        next();
      });

      function modifyUser(user) {
        return new Promise(function (resolve, reject) {
          DAL.users.updateUser(user._id, user, resolve);
        });
      }
    });
  },
};