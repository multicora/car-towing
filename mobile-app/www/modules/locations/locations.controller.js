(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = [
    'LocationsService',
    'AuthService',
    'snackbar'
  ];

  function LocationsController(
    LocationsService,
    AuthService,
    snackbar
  ) {
    var vm = this;

    vm.locations = null;

    LocationsService.getLocations().then(function (locations) {
      vm.locations = locations;
    }).catch(function (err) {
      var status = err.status;
      var message = status === 500 ? 'Connection error' : 'Something went wrong';

      if (status !== 401) {
        snackbar.show(message);
      }
    });

    vm.logout = function () {
      AuthService.logout();
    };

  }

})();
