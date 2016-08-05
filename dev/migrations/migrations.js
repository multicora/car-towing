'use strict';

const mongoose = require('mongoose');

const migrator = require('./migrator.js');
const DAL = require('./../dal/dal.js');

module.exports = function (cb) {
  const migrationOptions = {
    setDbVersion: setDbVersion,
    getDbVersion: getDbVersion,
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
  DAL.settings.get(function (res) {
    const v = res && res.version;
    cb(v);
  });
}