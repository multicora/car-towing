(function () {
  'use strict';
  angular.module('carTowingApp').service('PhotosService', PhotosService);

  PhotosService.$inject = ['$q', '$cordovaSQLite', '$ionicPlatform'];

  function PhotosService($q, $cordovaSQLite, $ionicPlatform) {

    var createQuery = 'create table if not exists "photos" (data TEXT)';

    this.addPhoto = function (imageData) {
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        var db = $cordovaSQLite.openDB({ name: "ultimateTowing.db", location: 'default' });
        var query = "INSERT INTO photos (data) VALUES (?)";

        return $cordovaSQLite.execute(db, createQuery).then(function(res) {
          return $cordovaSQLite.execute(db, query, [imageData]);
        }).then(function (data) {
          deferred.resolve(data);
        });
      });

      return deferred.promise;
    }
  }

})();
