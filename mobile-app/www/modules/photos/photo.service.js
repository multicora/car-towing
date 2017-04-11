(function () {
  'use strict';
  angular.module('carTowingApp').service('PhotosService', PhotosService);

  PhotosService.$inject = [
    '$q',
    '$cordovaSQLite',
    '$ionicPlatform',
    '$http',
    '$cordovaNetwork',
    'config'
  ];

  function PhotosService(
    $q,
    $cordovaSQLite,
    $ionicPlatform,
    $http,
    $cordovaNetwork,
    config
  ) {
    var _this = this;

    var createQuery = 'create table if not exists "photos" (data TEXT)';

    this.addPhoto = function (imageData, property, location, isEmergency) {
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        var db = $cordovaSQLite.openDB({ name: "ultimateTowing.db", location: 'default' });
        var query = "INSERT INTO photos (data, property, location, isEmergency, datetime) VALUES (?, ?, ?, ?, ?)";

        return $cordovaSQLite.execute(db, createQuery).then(function(res) {
          return $cordovaSQLite.execute(db, query, [imageData, property, location, isEmergency, (new Date()).getTime()]);
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

    this.uploadTowingPhoto = function (data, propertyId, datetime) {
      return $http.post(
        config.url + "/api/towing",
        {
          fileData: data,
          propertyId: propertyId,
          datetime: datetime
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

    this.tryUploadPhoto = function () {
      return $q(function (resolve) {
        if ( isWiFiConnected(getNetworkStatus()) ) {
          _this.getPhotos().then(function (res) {
            var photos = [];

            for (var i = res.rows.length - 1; i >= 0; i--) {
              photos.push(res.rows.item(i));
            }

            return photos;
          }).then(function (photos) {
            var photosToSend = photos.filter(function (photo) {
              return photo.isSent !== 'true';
            });

            sendPhotos(photosToSend).then(function () {
              resolve();
            }).catch(function () {
              resolve();
            });
          });
        }
      });
    };

    function getNetworkStatus() {
      return $cordovaNetwork.getNetwork();
    }

    function isWiFiConnected(network) {
      var CONNECTION_TYPES = {
        "WIFI": "wifi"
      };

      return network === CONNECTION_TYPES.WIFI;
    }

    function sendPhotos(photosToSend) {
      return sendNext(photosToSend, 0);

      function sendNext(photosToSend, index) {
        if ( isWiFiConnected(getNetworkStatus()) && photosToSend[index] ) {
          return sendPhoto(photosToSend[index]).then(function (res) {
            if (res.status === 200) {
              return _this.markPhotoAsRead(photosToSend[index]);
            } else {
              return $q.reject(res);
            }
          }).then(function () {
            return sendNext(photosToSend, index + 1);
          }).catch(function (err) {
            err.fileData = 'removed';
            console.error(JSON.stringify(err));
          });
        } else {
          return $q.resolve();
        }
      }
    }

    function sendPhoto(photo) {
      if (photo.isEmergency !== 'true') {
        return _this.uploadTowingPhoto(photo.data, photo.property, photo.datetime);
      } else {
        return _this.uploadEmergencyTowingPhoto(photo.data, photo.property, photo.location);
      }
    }
  }

})();
