(function () {
  'use strict';
  angular.module('carTowingApp').service('PhotosService', PhotosService);

  PhotosService.$inject = [
    '$q',
    '$cordovaSQLite',
    '$ionicPlatform',
    '$http',
    'config'
  ];

  function PhotosService(
    $q,
    $cordovaSQLite,
    $ionicPlatform,
    $http,
    config
  ) {

    var createQuery = 'create table if not exists "photos" (data TEXT)';

    this.addPhoto = function (imageData, property, location, isEmergency) {
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        var db = $cordovaSQLite.openDB({ name: "ultimateTowing.db", location: 'default' });
        var query = "INSERT INTO photos (data, property, location, isEmergency) VALUES (?, ?, ?, ?)";

        return $cordovaSQLite.execute(db, createQuery).then(function(res) {
          return $cordovaSQLite.execute(db, query, [imageData, property, location, isEmergency]);
        }).then(function (data) {
          deferred.resolve(data);
        });
      });

      return deferred.promise;
    };

    this.markPhotoAsRead = function (photo) {
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        var db = $cordovaSQLite.openDB({ name: "ultimateTowing.db", location: 'default' });
        var query = "UPDATE photos SET isSent = 'true' WHERE id = ?;";

        return $cordovaSQLite.execute(db, query, [photo.id]).then(function (data) {
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
    };

    this.uploadTowingPhoto = function (data, propertyId) {
      return $http.post(
        config.url + "/api/towing",
        {
          fileData: data,
          propertyId: propertyId
        }
      );
    };

    this.uploadEmergencyTowingPhoto = function (data, property, location) {
      return $http.post(
        config.url + "/api/emergency-towing",
        {
          fileData: data,
          propertyName: property,
          location: location
        }
      );
    };
  }

})();
