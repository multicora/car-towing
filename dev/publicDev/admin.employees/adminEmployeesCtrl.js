'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminEmployeesController', AdminEmployeesController);

  AdminEmployeesController.$inject = ['AdminEmployeesService', '$http', '$location'];

  function AdminEmployeesController(AdminEmployeesService, $http, $location) {
    var vm = this;

    AdminEmployeesService.getUsers()
      .then(function(res) {
        vm.usersData = res.data;
      });
  }
})();