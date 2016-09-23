'use strict';

const mongoose = require('mongoose');

const migrator = require('./migrator.js');
const DAL = require('./../dal/dal.js');

module.exports = function (cb) {
  const migrationOptions = {
    setDbVersion: setDbVersion,
    getDbVersion: getDbVersion,
    migrations: [
      require('./scripts/v001.js'),
      require('./scripts/v002.js'),
      require('./scripts/v003.js'),
      require('./scripts/v004.js'),
      require('./scripts/v005.js'),
      require('./scripts/v006.js'),
      require('./scripts/v007.js')
    ],
    done: cb
  };

  migrator(migrationOptions);
};

function setDbVersion(v, cb) {
  DAL.settings.update(
    {
      name: 'version',
      value: v
    },
    function (res) {
      const v = res && res.version;
      cb(v);
    }
  );
}

function getDbVersion(cb) {
  DAL.settings.getByName('version', function (err, res) {
    const v = res && res.value;
    cb(v);
  });
}