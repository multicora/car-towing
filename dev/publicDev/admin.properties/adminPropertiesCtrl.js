'use strict';

(function(angular) {
  angular
    .module('app')
    .controller('adminPropertiesCtrl', adminPropertiesCtrl);

  adminPropertiesCtrl.$inject = ['$filter', 'propertiesService', 'locationsService', '$location', '$scope'];

  function adminPropertiesCtrl($filter, propertiesService, locationsService, $location, $scope) {
    var vm = this;
    vm.adminProperties = [];
    vm.searchPropertyValue = '';
    vm.searchObj = {};

    locationsService.getLocations().then(function(response){
      vm.locations = response.data;
    });

    vm.getAdminProperties = function() {
      propertiesService.getProperties()
        .then(function(success) {
          vm.adminProperties = success.data;
        }, function(error) {
          console.error(error);
        });
    };

    vm.searchProperty = function() {
      vm.searchObj = {name: vm.searchPropertyValue};
    };

    vm.errorMes = '';

    function getUrl() {
      return [
        $location.protocol(),
        "://", $location.host(),
        ':', $location.port(),
        !$location.$$html5 ? '/#/' : '/'
      ].join('');
    }

    vm.addProperty = function(form) {
      if (form.$valid) {
        propertiesService.create(vm.newProperty)
        .then(function(success) {
          // TODO: replace with appropriate solution
          // vm.setPassLink = [getUrl(), success.data].join('');
          $location.path('/admin/properties');
        }, function(error) {
          // add appropriate logging
          vm.errorMes = error.data.message;
        });
      }
    }
  }
})(angular);