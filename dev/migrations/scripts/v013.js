'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 13,
  message: 'Set deleted default propery',
  script: function (next) {
    DAL.properties.get((err, docs) => {
      let i = 0;

      updateNext();

      function updateNext() {
        let property = docs[i];
        if (property) {
          console.log(i);
          i++
          DAL.properties.edit(property._id, {deleted: !!property.deleted}, updateNext);
        } else {
          next();
        }
      }
    });
  },
};