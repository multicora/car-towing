"use strict";

(() => {
  angular
    .module('app')
    .controller('adminPropertiesCtrl', adminPropertiesCtrl);

  adminPropertiesCtrl.$inject = ['adminPropertiesService'];

  function adminPropertiesCtrl(adminPropertiesService) {
    var vm = this;
    vm.adminProperties = [];
    vm.getAdminProperties = () => {
      adminPropertiesService.getAdminProperties()
        .then((success) => {
          vm.adminProperties = success.data;
        }, (error) => {
          console.error(error);
        });
    } 
  }
})();
