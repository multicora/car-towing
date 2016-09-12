'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminGotTowedController', AdminGotTowedController);

  AdminGotTowedController.$inject = ['AdminGotTowedService', '$http'];

  function AdminGotTowedController(AdminGotTowedService, $http) {
    var vm = this;

    vm.addGotTowed = addGotTowed;

    function addGotTowed(form){
      console.log(vm.data);
      AdminGotTowedService.send(vm.data)
        .then(function(success) {
          console.log('success');
        }, function(error) {
          console.log('error');
        });
    };
  }
})();