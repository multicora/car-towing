'use strict';

(function() {
  angular
    .module('app')
    .controller('userDataBinding', userDataBinding);

  userDataBinding.$inject = ['AdminEmployeesService', '$location', '$routeParams'];

  function userDataBinding(AdminEmployeesService, $location, $routeParams) {
    var vm = this;
    var userId = $routeParams.id;

    if (userId) {
      console.log(userId);
      AdminEmployeesService.getUserById(userId)
        .then(function(res) {
          vm.user = res.data;
          console.log(vm.user);
        });
     }

    vm.save = function() {
      AdminEmployeesService.add(vm.user);
      $location.path('/admin/employees');
    };
  }
})();