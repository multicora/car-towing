var mm = require('mongodb-migrations');

module.exports = function (options) {
  options = options || {};

  DB_VERSION = 3;
  MIGRATION_SCRIPTS_PREFIX = 'toV'
  DEBUG = false;

  var handlers = options.handlers,
    migrations = {},
    currentDbVersion;

  if (handlers) {
    // Check version
    handlers.settings._getSetting('version', function (err, data) {
      if (!data) {
        handlers.settings._setSetting('version', 0, function (err) {
          currentDbVersion = 0;
          versionCheckingCb();
        });
      } else {
        currentDbVersion = parseInt(data.value, 10);
        versionCheckingCb();
      }
    });
  }

  // Scripts
  addMigration ({
    message: 'Creating admin role.',
    script: function (next, err) {
      handlers.roles._create(
        {
          name: 'Administrator',
          description: 'Role for site administration',
          code: 'admin'
        },
        next,
        err
      );
    }
  }, 1);
  addMigration ({
    message: 'Create user "Administrator".',
    script: function (next, err) {
      handlers.users._create(
        {
          name: 'Frunk Lern',
          email: 'frunk.lern@gmail.com',
          password: 'password'
        },
        next,
        err
      );
    }
  }, 2);
  addMigration ({
    message: 'Add "Administrator" role to "Administrator" user.',
    script: function (next, err) {
      handlers.users._get(
        {
          email: 'frunk.lern@gmail.com'
        },
        getUserCb,
        err
      );

      function getUserCb (users) {
        var user;

        if (users.length > 0) {
          user = users[0];
          handlers.roles._get(
            {
              code: 'admin'
            },
            function (roles) {
              var role;

              if (roles.length > 0) {
                role = roles[0];
                createRole2User(user, role);
              } else {
                err(404);
              }
            },
            err
          );
        } else {
          err(404);
        }
      }

      function createRole2User (user, role) {
        handlers.roles2users._create(
          {
            role: role._id,
            user: user._id
          },
          next,
          err
        );
      }
    }
  }, 3);

  function addMigration (migration, v) {
    if (migrations[MIGRATION_SCRIPTS_PREFIX + v]) {
      console.log('Migration with this version already exists.');
    } else {
      migrations[MIGRATION_SCRIPTS_PREFIX + v] = migration;
    }
  }

  function versionCheckingCb () {
    if (currentDbVersion < DB_VERSION) {
      console.log('Migration start.');
      runAllMigrations(function () {
        if (DEBUG) {
          console.log('Migration done.');
        } else {
          setDbVersion(DB_VERSION, function (err) {
            currentDbVersion = DB_VERSION;
            console.log('Migration done.');
          });
        }
      });
    }
  }

  function runAllMigrations(doneCallback) {
    var index = currentDbVersion;

    if (index < DB_VERSION) {
      next();
    } else {
      doneCallback();
    }

    function next () {
      var currentMigration;

      index++;
      currentMigration = migrations[MIGRATION_SCRIPTS_PREFIX + index];

      runMigration(
        currentMigration.script,
        currentMigration.message,
        function () {
          if (index < DB_VERSION) {
            next();
          } else {
            doneCallback();
          }
        }
      );
    }
  }

  function setDbVersion(v, cb) {
    handlers.settings._setSetting('version', v, cb);
  };

  // migrationFunc {function(next)}
  // msg {string}
  // callback {function}
  function runMigration (migrationFunc, msg, callback) {
    if (typeof migrationFunc === 'function') {
      migrationFunc(migrationEnd, error);
    } else {
      migrationEnd();
    }

    function migrationEnd () {
      if (msg) {
        console.log('    ' + msg);
      }
      if (typeof callback === 'function') {
        callback();
      }
    }

    function error(err) {
      console.log('Error:');
      console.log(err);
    }
  }

};