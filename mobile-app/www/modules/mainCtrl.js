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

    PhotosService.tryUploadPhotos();
  }

})();
