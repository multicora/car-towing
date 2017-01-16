(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('mainCtrl', ctrl);

  ctrl.$inject = [
    '$q',
    '$cordovaNetwork',
    'PhotosService'
  ];

  function ctrl(
    $q,
    $cordovaNetwork,
    PhotosService
  ) {
    var vm = this;

    var CONNECTION_TYPES = {
      "WIFI": "wifi"
    }

    var network = $cordovaNetwork.getNetwork();
    if (network === CONNECTION_TYPES.WIFI) {
      PhotosService.getPhotos().then(function (res) {
        var photos = [];

        for (var i = res.rows.length - 1; i >= 0; i--) {
          photos.push(res.rows.item(i));
        }

        return photos;
      }).then(function (photos) {
        var photosToSend = photos.filter(function (photo) {
          return photo.isSent !== 'true';
        });

        sendNext(photosToSend, 0);

        function sendNext(photosToSend, index) {
          sendPhoto(photosToSend[index]).then(function (res) {
            if (res.status === 200) {
              return PhotosService.markPhotoAsRead(photosToSend[index]);
            } else {
              return $q.reject();
            }
          }).then(function () {
            sendNext(photosToSend, index + 1);
          });
        }
      });

      function sendPhoto(photo) {
        if ($cordovaNetwork.getNetwork() === CONNECTION_TYPES.WIFI && photo) {
          if (photo.isEmergency !== 'true') {
            return PhotosService.uploadTowingPhoto(photo.data, photo.property);
          } else {
            return PhotosService.uploadEmergencyTowingPhoto(photo.data, photo.property, photo.location);
          }
        } else {
          return $q.reject();
        }
      }
    }
  }

})();
