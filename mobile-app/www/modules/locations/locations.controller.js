(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['LocationsService', '$stateParams', '$cordovaCamera', 'AuthService'];

  function LocationsController(LocationsService, $stateParams, $cordovaCamera, AuthService) {
    var vm = this;

    vm.locations = LocationsService.locations;

    vm.getLocations = function () {
      LocationsService.getLocations();
    };

    vm.logout = function () {
      AuthService.logout();
    }

  }

})();
