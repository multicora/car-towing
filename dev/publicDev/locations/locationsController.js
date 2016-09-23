(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app');
  var injections = ['locationsService'];

  function locationsCtrl(locationsService) {

    var vm = this;

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
    }

    // // TODO: future update functionality
    // vm.edit = function(location) {
    //   locationsService.update(location._id, location).then(function() {
    //     getAllRules(property._id);
    //   });
    // }

    vm.remove = function(id) {
      locationsService.remove(id).then(function() {
        getAllLocations();
      });
    }
  }

  locationsCtrl.$inject = injections;
  app.controller('locationsCtrl', locationsCtrl);

})(window, document, angular);