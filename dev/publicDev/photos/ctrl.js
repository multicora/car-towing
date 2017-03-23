'use strict';

(function(angular) {
  angular.module('app').controller('photosCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    'photoesService',
    'AdminEmployeesService'
  ];

  function ctrl(
    $routeParams,
    photoesService,
    AdminEmployeesService
  ) {
    var vm = this;

    vm.photos = [];
    vm.emergencyTowing = [];

    if ($routeParams.propertyId === "emergency_towing") {
      photoesService.getEmergencyTowing().then(function(res) {
        vm.emergencyTowing = res.data;
      });
    } else {
      photoesService.getPhotos($routeParams.propertyId).then(function (res) {
        vm.photos = res.data;

        return vm.photos;
      }).then(function (photos) {
        vm.promiseArr = [];
        photos.map(function (photo) {
          vm.promiseArr.push(AdminEmployeesService.getUserById(photo.ownerId));
        });

        return Promise.all(vm.promiseArr);
      }).then(function (users) {
        var time;

        for (var i = 0; i < vm.photos.length; i++) {
          time = new Date(vm.photos[i].updated);
          vm.photos[i].updated = time.toLocaleDateString() + ' ' + time.toLocaleTimeString();
          vm.photos[i].ownerNumber = users[i].data.number;
        }

        vm.promiseArr = [];
      });
    }


  }
})(angular);
