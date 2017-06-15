(function () {
  'use strict';
  angular.module('carTowingApp')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = [
    '$log',
    '$q',
    'PhotosService',
    'PropertiesService',
    'snackbar'
  ];

  function PhotosController(
    $log,
    $q,
    PhotosService,
    PropertiesService,
    snackbar
  ) {
    var vm = this;

    vm.photos = [];

    PhotosService.getPhotos().then(function (res) {
      for (var i = res.rows.length - 1; i >= 0; i--) {
        vm.photos.push(res.rows.item(i));
      }
      return vm.photos;
    }).then(function (photos) {
      var promises = photos.map(function (item) {
        return getPropertyName(item);
      });

      return $q.all(promises);
    }).then(function (propertyNames) {
      var promises = vm.photos.map(function (item, index) {
        var time = new Date( parseInt(item.datetime, 10) );
        var response;

        item.propertyName = propertyNames[index];
        item.viewTime = time.toLocaleDateString() + ' ' + time.toLocaleTimeString();

        if (item.isSent !== 'true') {
          response = PhotosService.tryUploadPhoto(item).then(function () {
            item.isSent = 'true';
          });
        } else {
          response = $q.resolve();
        }

        return response;
      });

      return $q.all(promises);
    }).catch(function (err) {
      $log.error(err);

      err.status !== 401 && snackbar.showError(err);
    });

    function getPropertyName(photo) {
      var deferred = $q.defer();

      if (photo.isEmergency === 'true') {
        deferred.resolve(photo.property);
      } else {
        PropertiesService.getById(photo.property).then(function (property) {
          deferred.resolve(property.name);
        }).catch(function (err) {
          deferred.reject(err);
        });
      }

      return deferred.promise;
    }
  }

})();
