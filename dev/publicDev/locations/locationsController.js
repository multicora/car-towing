(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app');
  var injections = ['locationsService'];

  function locationsCtrl(locationsService) {

    var vm = this;
    var lastEditedLocation = null;

    function getAllLocations() {
      locationsService.getLocations().then(function(response){
        vm.locations = response.data;
      });
    }

    getAllLocations();

    function clearNewLocation() {
      vm.newLocation = {}
    }

    vm.add = function(location) {
      locationsService.create(location).then(function() {
        clearNewLocation();
        getAllLocations();
      });
    };

    vm.remove = function(id) {
      locationsService.remove(id).then(function() {
        getAllLocations();
      });
    };

    vm.editMode = function (location) {
      if (lastEditedLocation) {
        lastEditedLocation.editMode = false;
      }
      if (location) {
        location.editMode = true;
      }
      lastEditedLocation = location;
    };

    vm.editLocation = function (location) {
      locationsService.edit(location._id, location).then(function() {
        vm.editMode();
        getAllLocations();
      });
    };

  }

  locationsCtrl.$inject = injections;
  app.controller('locationsCtrl', locationsCtrl);

})(window, document, angular);