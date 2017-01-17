'use strict';

(function(angular) {
  angular.module('app').controller('photosCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    'propertiesService'
  ];

  function ctrl(
    $routeParams,
    propertiesService
  ) {
    var vm = this;

    vm.photos = [];

    propertiesService.getPhotos($routeParams.propertyId).then(function (res) {
      vm.photos = res.data;
    });
  }
})(angular);
