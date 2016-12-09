'use strict';

(function(angular) {
  angular
    .module('app')
    .controller('adminPropertiesEditCtrl', adminPropertiesEditCtrl);

  adminPropertiesEditCtrl.$inject = ['propertiesService', 'locationsService', '$location', '$routeParams'];

  function adminPropertiesEditCtrl(propertiesService, locationsService, $location, $routeParams) {
    var vm = this;
    var propId = $routeParams.id;

    vm.contractTerms = propertiesService.getTerms();

    if (propId) {
      vm.editMod = true;
    
      locationsService.getLocations()
        .then(function(response){
          vm.locations = response.data;
        });

      propertiesService.getProperty(propId)
        .then(function(success) {
          vm.newProperty = success.data;
        }, function(error) {
          console.error(error);
        });
    }

    vm.editProperty = function(id) {
      propertiesService.update(id, vm.newProperty)
        .then(function(success) {
          $location.path('/admin/properties');
        }, function(error) {
          vm.errorMes = error.data.message;
        }
      )};

    vm.activateContract = function(propertyContractTerm) {
      propertiesService.activateContract(propId, propertyContractTerm);
    };
  }
})(angular);