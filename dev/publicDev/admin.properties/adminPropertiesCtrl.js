"use strict";

(() => {
  angular.module('app')
    .controller('adminPropertiesCtrl', ctrl);

  ctrl.$inject = ['propertyService', '$location', '$scope'];

  function ctrl(propertyService, $location, $scope) {
    var vm = this;
    vm.login = ''; 
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
        propertyService.create(vm.newProperty)
        .then((success) => {
          $location.path('/admin/properties');
        }, (error) => {
          vm.errorMes = error.data.message;
        });
      }
    }
  }
})();
