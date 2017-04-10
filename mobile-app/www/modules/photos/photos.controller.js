(function () {
  'use strict';
  angular.module('carTowingApp')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = [
    '$q',
    'PhotosService',
    'PropertiesService'
  ];

  function PhotosController(
    $q,
    PhotosService,
    PropertiesService
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
      vm.photos.forEach(function (item, index) {
        item.propertyName = propertyNames[index];
      });
    });

    PhotosService.tryUploadPhoto();

    function getPropertyName(photo) {
      var deferred = $q.defer();

      if (photo.isEmergency === 'true') {
        deferred.resolve(photo.property);
      } else {
        PropertiesService.getById(photo.property).then(function (property) {
          deferred.resolve(property.name);
        });
      }

      return deferred.promise;
    }
  }

})();
