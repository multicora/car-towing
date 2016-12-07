(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['LocationsService', '$stateParams', 'AuthService'];

  function LocationsController(LocationsService, $stateParams, AuthService) {
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
