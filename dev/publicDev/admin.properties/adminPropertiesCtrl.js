"use strict";

(() => {
  angular
    .module('app')
    .controller('adminPropertiesCtrl', adminPropertiesCtrl);

  adminPropertiesCtrl.$inject = ['$filter', 'propertiesService', '$location', '$scope'];

  function adminPropertiesCtrl($filter, propertiesService, $location, $scope) {
    var vm = this;
    vm.adminProperties = [];
    vm.searchPropertyValue = '';
    vm.searchObj = {};

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

    vm.selectFile = function() {
      document.getElementById('file').click();
    };

    $scope.convertToBase64 = function(event){
      var f = document.getElementById('file').files[0],
      r = new FileReader();
      r.onloadend = function(e){
        // TODO: converted to base64 image
        vm.newProperty.logo = e.target.result;
      }
      r.readAsDataURL(f);
    }

    vm.addProperty = function(form) {
      if (form.$valid) {
        propertiesService.create(vm.newProperty)
        .then((success) => {
          $location.path('/admin/properties');
        }, (error) => {
          vm.errorMes = error.data.message;
        });
      }
    }
  }
})();
