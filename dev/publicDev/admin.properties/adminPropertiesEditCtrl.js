'use strict';

(function(angular) {
  var app = angular.module('app');

  app.controller('adminPropertiesEditCtrl', adminPropertiesEditCtrl);

  adminPropertiesEditCtrl.$inject = [
    'propertiesService',
    'locationsService',
    'contractsService',
    '$location',
    '$routeParams'
  ];

  function adminPropertiesEditCtrl(
    propertiesService,
    locationsService,
    contractsService,
    $location,
    $routeParams
  ) {
    var vm = this;
    var propId = $routeParams.id;

    vm.contractTerms = contractsService.getTerms();

    if (propId) {
      vm.editMod = true;

      locationsService.getLocations().then(function(response){
        vm.locations = response.data;
      });

      propertiesService.getProperty(propId).then(function(success) {
        vm.newProperty = success.data;
      }, function(error) {
        console.error(error);
      });

      contractsService.getByProperty(propId).then(function (res) {
        vm.contracts = res.data.map(parseContract);
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
      contractsService.activate(propId, propertyContractTerm);
    };
  }

  function parseContract(contract) {
    let activationDate = new Date(contract.activationDate);
    let endDate = new Date(activationDate.getTime() + contract.term);
    
    return {
      activationDate: activationDate.toLocaleString(),
      endDate: endDate.toLocaleString()
    };
  }
})(angular);