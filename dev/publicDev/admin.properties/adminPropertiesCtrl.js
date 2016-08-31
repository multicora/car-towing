"use strict";

(() => {
  angular.module('app')
    .controller('adminPropertiesCtrl', adminPropertiesCtrl);

  adminPropertiesCtrl.$inject = ['adminPropertiesService'];

  function adminPropertiesCtrl(adminPropertiesService) {
    var vm = this;
		vm.adminProperties = [];
		vm.emptyMess = '';
		vm.errorMess = '';
		vm.logo = '/files/property.png';
		vm.getAdminProperties = () => {
			adminPropertiesService.getAdminProperties()
				.then((success) => {
					console.log(success);
					vm.adminProperties = success.data;
					if(vm.adminProperties.length) {
						vm.emptyMess = 'Any properties';
					}
				}, (error) => {
					console.error(error);
					vm.errorMess = error.data.error;
				});
		} 
  }
})();
