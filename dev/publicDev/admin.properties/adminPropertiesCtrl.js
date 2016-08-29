"use strict";

(() => {
  angular.module('app')
    .controller('adminPropertiesCtrl', ctrl);

  ctrl.$inject = ['propertyService', '$location'];

  function ctrl(propertyService, $location) {
    var vm = this;
    vm.login = ''; 
    vm.name = '';
    vm.errorMes = '';

    vm.addProperty = function(form) {
      if (form.$valid) {
        propertyService.create(vm.name)
        .then((success) => {
          $location.path('/admin/properties');
        }, (error) => {
          vm.errorMes = error.data.message;
        });
      }
    }
  }
})();
