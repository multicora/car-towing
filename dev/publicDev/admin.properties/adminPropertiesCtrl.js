"use strict";

(() => {
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

    vm.getAdminProperties = () => {
      propertiesService.getProperties()
        .then((success) => {
          vm.adminProperties = success.data;
        }, (error) => {
          console.error(error);
        });
    };

    vm.searchProperty = () => {
      vm.searchObj = {name: vm.searchPropertyValue};
    };

    vm.errorMes = '';
    vm.newProperty = {};

    vm.selectFile = function(e) {
      e.preventDefault();
      document.getElementById('file').click();
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
        .then((success) => {
          // TODO: replace with appropriate solution
          vm.setPassLink = [getUrl(), success.data].join('');
          // $location.path('/admin/properties');
        }, (error) => {
          // add appropriate logging
          vm.errorMes = error.data.message;
        });
      }
    }
  }
})();
