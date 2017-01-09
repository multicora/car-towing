(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['LocationsService', 'DatabaseService', 'AuthService', 'PhotosService'];

  function LocationsController(LocationsService, DatabaseService, AuthService, PhotosService) {
    var vm = this;

    vm.locations = LocationsService.locations;

    vm.getLocations = function () {
      LocationsService.getLocations();
    };

    vm.logout = function () {
      AuthService.logout();
    };

    vm.addPhotoTest = function () {

      var d = new Date,
        dformat = [ (d.getMonth()+1).padLeft(),
            d.getDate().padLeft(),
            d.getFullYear()].join('/')+
          ' ' +
          [ d.getHours().padLeft(),
            d.getMinutes().padLeft()].join(':');
      var data = "data:image/jpeg;base64," + 'test';

      var photoObj = {
        name: "No name for test",
        base64: data,
        date: dformat,
        sent: false,
        deleted: false
      };

      PhotosService.addPhoto(photoObj);
    };

  }

})();
