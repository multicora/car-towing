'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 18,
  message: 'Add date to photos',
  script: (next) => {
    DAL.files.getAll((err, resp) => {
      let length = resp.length;
      let i = 0;
      let number = 0;
      let promiseArr = [];

      for(; i < length; i++) {
        resp[i].updated = Date.now();

        promiseArr.push(modifyFile(resp[i]));
      }

      Promise.all(promiseArr).then(function () {
        next();
      });

      function modifyFile(file) {
        return new Promise(function (resolve, reject) {
          DAL.files.update(file._id, file, resolve);
        });
      }
    });
  },
};