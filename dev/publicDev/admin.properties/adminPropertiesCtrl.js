"use strict";

(() => {
  angular
    .module('app')
    .controller('adminPropertiesCtrl', adminPropertiesCtrl);

  adminPropertiesCtrl.$inject = ['adminPropertiesService', '$filter'];

  function adminPropertiesCtrl(adminPropertiesService, $filter) {
    var vm = this;
    vm.adminProperties = [];
    vm.searchPropertyValue = '';
    vm.searchObj = {};

    vm.getAdminProperties = () => {
      adminPropertiesService.getAdminProperties()
        .then((success) => {
          vm.adminProperties = success.data;
        }, (error) => {
          console.error(error);
        });
    };

    vm.searchProperty = () => {
      vm.searchObj = {name: vm.searchPropertyValue};
    };
  }
})();
