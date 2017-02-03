'use strict';

(function(angular) {
  angular.module('app').controller('photosCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    'propertiesService',
    'AdminEmployeesService',
    'emergencyTowingService'
  ];

  function ctrl(
    $routeParams,
    propertiesService,
    AdminEmployeesService,
    emergencyTowingService
  ) {
    var vm = this;

    vm.photos = [];
    vm.emergencyTowing = [];

    if ($routeParams.propertyId === "emergency_towing") {
      emergencyTowingService.getEmergencyTowing().then(function(res) {
        vm.emergencyTowing = res.data;
      });
    } else {
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


  }
})(angular);
