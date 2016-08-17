'use strict';

const _ = require('lodash');

module.exports = function (options) {
  options = options || {};

  const DEBUG = false;

  options.getDbVersion(function (v) {
    if (v) {
      versionCb(v);
    } else {
      options.setDbVersion(0, _.bind(versionCb, null, 0));
    }
  });

  function versionCb(v) {
    var migrations = fillMigrations(options.migrations || []);

    runAllMigrations(
      migrations,
      parseInt(v, 10),
      function (v) {
        if (!DEBUG) {
          console.log('    DB version: ' + v)
          options.setDbVersion(v, options.done);
        } else {
          options.done();
        }
      }
    );
  }

  function fillMigrations(migrations) {
    let mg = {};

    migrations.forEach(function (migration) {
      if (mg[migration.version]) {
        console.log('    Migration with this version already exists.');
      } else {
        mg[migration.version] = migration;
      }
    });

    return mg;
  }

  function runAllMigrations(migrations, currentDbVersion, doneCallback) {
    var index = currentDbVersion;

    next(migrations, index + 1, doneCallback);

    function next (migrations, v, cb) {
      var currentMigration = migrations[v];

      if (currentMigration) {
        runMigration(
          currentMigration.script,
          currentMigration.message,
          _.bind(next, null, migrations, v + 1, cb)
        );
      } else {
        cb(v - 1);
      }
    }
  }

  // migrationFunc {function(next)}
  // msg {string}
  // callback {function}
  function runMigration (migrationFunc, msg, callback) {
    migrationFunc(
      _.bind(migrationEnd, null, msg, callback)
    );
  }

  function migrationEnd(msg, cb, err) {
    if (err) {
      console.log('    Error while migrating:');
      console.log(err);
    } else {
      console.log('    Finished: ' + msg);
      cb();
    }
  }
};