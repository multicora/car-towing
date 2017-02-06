'use strict';

(function(angular) {
  var app = angular.module('app');

  app.controller('adminPropertiesEditCtrl', adminPropertiesEditCtrl);

  adminPropertiesEditCtrl.$inject = [
    'propertiesService',
    'locationsService',
    'contractsService',
    '$location',
    '$routeParams',
    '$scope'
  ];

  function adminPropertiesEditCtrl(
    propertiesService,
    locationsService,
    contractsService,
    $location,
    $routeParams,
    $scope
  ) {
    var vm = this;
    var propId = $routeParams.id;

    vm.contractTerms = contractsService.getTerms();
    vm.newProperty = {};

    function getContacts() {
      contractsService.getByProperty(propId).then(function (res) {
        vm.contracts = res.data.map(parseContract);
      });
    }

    function getUrl() {
      return [
        $location.protocol(),
        "://", $location.host(),
        ':', $location.port(),
        !$location.$$html5 ? '/#/' : '/'
      ].join('');
    }

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

      getContacts();
    }

    vm.changeManager = function() {
      vm.changeMod = true;
    }

    vm.saveNewManager = function() {
      propertiesService.newManager({
        propertyId: propId,
        email: vm.newManager
      }).then(function(success) {
      }, function (err) {
        vm.errorMes = err;
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

    vm.removeProperty = function (id) {
      propertiesService.delete(id)
      .then(function(success) {
        $location.path('/admin/properties');
      }, function(error) {
        vm.errorMes = error.data.message;
      });
    }

    vm.activateContract = function(propertyContractTerm, contractDateFrom) {
      contractsService.activate(propId, propertyContractTerm, contractDateFrom);

      getContacts();
    };

    $scope.convertToBase64 = function(event){
      var f = document.getElementById('file').files[0],
      r = new FileReader();
      r.onloadend = function(e){
        // TODO: converted to base64 image
        vm.newProperty.logo = e.target.result;
        $scope.$digest();
      }
      r.readAsDataURL(f);
    }
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