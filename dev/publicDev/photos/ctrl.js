'use strict';

(function(angular) {
  angular.module('app').controller('photosCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    'propertiesService',
    'AdminEmployeesService'
  ];

  function ctrl(
    $routeParams,
    propertiesService,
    AdminEmployeesService
  ) {
    var vm = this;

    vm.photos = [];

    propertiesService.getPhotos($routeParams.propertyId).then(function (res) {
      vm.photos = res.data;

      return vm.photos;
    }).then(function (photos) {
      vm.promiseArr = [];
      photos.map(function (photo) {
        vm.promiseArr.push(AdminEmployeesService.getUserById(photo.ownerId));
      });

      return Promise.all(vm.promiseArr);
    }).then(function (users) {

      for (var i = 0; i < vm.photos.length; i++) {
        vm.photos[i].updated = new Date(vm.photos.updated);
        vm.photos[i].ownerNumber = users[i].data.number;
      }

      vm.promiseArr = [];
    });
  }
})(angular);
