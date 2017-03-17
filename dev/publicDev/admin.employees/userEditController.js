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
        });
      vm.save = function() {
        AdminEmployeesService.editUser(userId, vm.user)
          .then(function(res) {
            if (res.data.statusCode != 200) {
              vm.error = res.data.message;
            } else {
              $location.path('/admin/employees');
            }
          });
      };
     } else {
       vm.save = function() {
         AdminEmployeesService.add(vm.user)
          .then(function(res) {
            if (res.data.statusCode != 200) {
              vm.error = res.data.message;
            } else {
              $location.path('/admin/employees');
            }
          });
       };
     }


  }
})();