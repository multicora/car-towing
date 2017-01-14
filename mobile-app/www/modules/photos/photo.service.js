(function () {
  'use strict';
  angular.module('carTowingApp').service('PhotosService', PhotosService);

  PhotosService.$inject = ['$q', '$cordovaSQLite', '$ionicPlatform'];

  function PhotosService($q, $cordovaSQLite, $ionicPlatform) {

    var createQuery = 'create table if not exists "photos" (data TEXT)';

    this.addPhoto = function (imageData, property, isEmergency) {
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        var db = $cordovaSQLite.openDB({ name: "ultimateTowing.db", location: 'default' });
        var query = "INSERT INTO photos (data, property, isEmergency) VALUES (?, ?, ?)";

        return $cordovaSQLite.execute(db, createQuery).then(function(res) {
          return $cordovaSQLite.execute(db, query, [imageData, property, isEmergency]);
        }).then(function (data) {
          deferred.resolve(data);
        });
      });

      return deferred.promise;
    }

    this.getPhotos = function () {
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        var db = $cordovaSQLite.openDB({ name: "ultimateTowing.db", location: 'default' });
        var query = "select * from photos";

        return $cordovaSQLite.execute(db, query).then(function (res) {
          deferred.resolve(res);
        });
      });

      return deferred.promise;
    }
  }

})();
