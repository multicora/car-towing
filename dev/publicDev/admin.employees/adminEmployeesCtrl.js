'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminEmployeesController', AdminEmployeesController);

  AdminEmployeesController.$inject = ['AdminEmployeesService', '$http', '$location'];

  function AdminEmployeesController(AdminEmployeesService, $http, $location) {
    var vm = this;

    var getAllUsers = function() {
      AdminEmployeesService.getUsers()
        .then(function(res) {
          vm.usersData = res.data;
          console.log(vm.usersData);
        });
    };

    getAllUsers();

    vm.blockUser = function(userId) {
      AdminEmployeesService.blockUser(userId)
      .then(function() {
        getAllUsers();
      });
    }

    vm.unBlockUser = function(userId) {
      AdminEmployeesService.unBlockUser(userId)
      .then(function() {
        getAllUsers();
      });
    }
  }
})();