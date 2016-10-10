(function() {
  'use strict';

  angular.module('carTowingApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = [];

  function LoginController() {
    var vm = this;

    vm.user = {
      login: '',
      password: ''
    };
    vm.errorMes = "";

    vm.signIn = function() {
      console.log(vm.user);
      vm.errorMes = "User not found";
    }
  }

})();
