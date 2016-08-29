"use strict";

(() => {
  angular.module('app')
    .controller('adminPropertiesCtrl', ctrl);

  ctrl.$inject = ['propertyService', 'DataService'];

  function ctrl(propertyService, DataService) {
    var vm = this;
    vm.login = ''; 
    vm.name = '';

    vm.addProperty = function(form) {
      if (form.$valid) {
        propertyService.create(vm.name)
        .then((success) => {
          console.log(success);
        }, (error) => {
          console.log(error);
        });
      }
    }
  }
})();
