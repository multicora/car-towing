"use strict";

(() => {
  angular.module('app')
    .controller('adminPropertiesCtrl', ctrl);

  ctrl.$inject = ['propertyService', 'DataService'];

  function ctrl(propertyService, DataService) {
    var vm = this;
    vm.login = ''; 
    vm.name = '';

    vm.addProperty = addProperty;

    function addProperty() {
      DataService.login(vm.login)
      .then((success) => {
        propertyService.postProperty(vm.name)
          .then((success) => {
            console.log(success);
          }, (error) => {
            console.log(error);
          });
      }, (error) => {
        console.log(error);
      });
    }
  }
})();
