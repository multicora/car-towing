'use strict';

const DAL = require('./../../dal/dal.js');
const passwordHash = require('password-hash');

module.exports = {
  version: 17,
  message: 'Add number for users.',
  script: (next) => {
    DAL.users.get((err, resp) => {
      let length = resp.length;
      let i = 0;
      let number = 0;
      let promiseArr = [];

      for(; i < length; i++) {
        if (!resp[i].number) {
          if (number < 100) {
            if (number < 10) {
              resp[i].number = "00" + number;
            } else {
              resp[i].number = "0" + number;
            }
          } else {
            resp[i].number = number;
          }
          number++;
          promiseArr.push(modifyUser(resp[i]));
        }
      }

      Promise.all(promiseArr).then(function () {
        next();
      });

      function modifyUser(user) {
        console.log(user);
        return new Promise(function (resolve, reject) {
          DAL.users.updateUser(user._id, user, resolve);
        });
      }
    });
  },
};