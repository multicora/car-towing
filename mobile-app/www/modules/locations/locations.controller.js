(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['LocationsService', 'AuthService'];

  function LocationsController(LocationsService, AuthService) {
    var vm = this;

    vm.locations = null;

    console.log('some3');

    LocationsService.getLocations().then(function (locations) {
      vm.locations = locations;
    });

    vm.logout = function () {
      AuthService.logout();
    };

  }

})();
