'use strict';

(function() {
  angular
    .module('app')
    .controller('userEditController', userEditController);

  userEditController.$inject = ['AdminEmployeesService', '$location', '$routeParams'];

  function userEditController(AdminEmployeesService, $location, $routeParams) {
    var vm = this;
    var userId = $routeParams.id;

    if (userId) {
      AdminEmployeesService.getUserById(userId)
        .then(function(res) {
          vm.user = res.data;
          console.log(vm.user);
        });
      vm.save = function() {
        AdminEmployeesService.editUser(userId, vm.user)
          .then(function() {
            $location.path('/admin/employees');
          });
      };
     } else {
       vm.save = function() {
         AdminEmployeesService.add(vm.user)
          .then(function() {
            $location.path('/admin/employees');
          });
       };
     }


  }
})();