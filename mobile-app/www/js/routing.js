(function () {
  'use strict';

  angular.module('carTowingApp').service('migrations', service);

  service.$inject = ['$q', '$cordovaSQLite', '$ionicPlatform'];

  function service($q, $cordovaSQLite, $ionicPlatform) {
    var createVersionTable = 'CREATE TABLE if not exists "settings" (name TEXT, value TEXT, UNIQUE(name))';
    var insertVersionField = 'insert or ignore into "settings" (name, value) values ("version", "0")';

    var getVersion = 'select value from settings where name = "version"';
    var setVersion = 'update settings set value = ? where name = "version"';

    var migrations = [
      'create table if not exists "photos" (data TEXT)',
      'alter table "photos" add "isSent" BOOLEAN constraint "isSentDefault" default false',
      'DELETE FROM photos',
      'alter table "photos" add "property" TEXT',
      'alter table "photos" add "isEmergency" BOOLEAN constraint "isEmergencyDefault" default false',
      'DELETE FROM photos',
      'alter table "photos" add "location" TEXT',
      'DROP TABLE photos;',
      'CREATE TABLE photos (id integer primary key autoincrement, data TEXT, isSent BOOLEAN default false, property text, isEmergency BOOLEAN default false, location text);',
      'DROP TABLE photos;',
      'CREATE TABLE photos (id integer primary key autoincrement, data TEXT, isSent BOOLEAN default false, property text, isEmergency BOOLEAN default false, location text, datetime text);'
    ];

    this.run = function () {
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        var db = $cordovaSQLite.openDB({ name: "ultimateTowing.db", location: 'default' });

        return $cordovaSQLite.execute(db, createVersionTable).then(function(res) {
          return $cordovaSQLite.execute(db, insertVersionField);
        }).then(function () {
          return $cordovaSQLite.execute(db, getVersion);
        }).then(function (res) {
          var version = res.rows.item(0).value;
          console.log('-========== Current db version');
          console.log( JSON.stringify(version) );
          return version;
        }).then(function (version) {
          var promises = [];

          for (var i = version; i < migrations.length; i++) {
            promises.push($cordovaSQLite.execute(db, migrations[i]));
          }
          return $q.all(promises);
        }).then(function () {
          return $cordovaSQLite.execute(db, setVersion, [migrations.length]);
        }).then(
          function () {
            console.log('-========== Set new db version');
            console.log( JSON.stringify(migrations.length) );
            deferred.resolve();
          },
          function (err) {
            console.log('-========== Migration error');
            console.log(JSON.stringify(err));
            deferred.resolve(err);
          }
        );

      });

      return deferred.promise;
    };
  }
})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'TokenServiceProvider',
    'migrationsProvider',
    'RollbarProvider'
  ];

  function config(
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    TokenServiceProvider,
    migrationsProvider,
    RollbarProvider
  ) {
    var migrations = migrationsProvider.$get();
    $httpProvider.interceptors.push('httpInterceptor');
    var TokenService = TokenServiceProvider.$get();
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

    RollbarProvider.init({
      accessToken: '6e2feb0a351a4d01b56883d1fa3e3408',
      captureUncaught: true,
      payload: {
        environment: 'production'
      }
    });

    /* Routing */
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'modules/auth/login.tmpl.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        resolve: getResolver()
      })
      .state('locations', {
        url: '/locations',
        templateUrl: 'modules/locations/locations.tmpl.html',
        controller: 'LocationsController',
        controllerAs: 'vm',
        cache: false,
        resolve: getResolver()
      })
      .state('properties', {
        url: '/properties/:locationId',
        templateUrl: 'modules/properties/properties.tmpl.html',
        controller: 'PropertiesController',
        controllerAs: 'vm',
        cache: false,
        resolve: getResolver()
      })
      .state('decal', {
        url: '/decal/:propertyId',
        templateUrl: 'modules/decal/decal.tmpl.html',
        controller: 'DecalController',
        controllerAs: 'vm',
        resolve: getResolver()
      })
      .state('photos', {
        url: '/photos',
        templateUrl: 'modules/photos/photos.tmpl.html',
        controller: 'PhotosController',
        controllerAs: 'vm',
        resolve: getResolver()
      });

    $urlRouterProvider.otherwise('/locations');

    function getResolver() {
      return {
        db: migrations.run
      };
    }
  }
})();
