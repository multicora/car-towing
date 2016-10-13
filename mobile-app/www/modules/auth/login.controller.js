(function() {
  'use strict';

  angular
    .module('carTowingApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['AuthService','$state', 'TokenService'];

  function LoginController(AuthService, $state, TokenService) {
    var vm = this;

    vm.user = {
      login: '',
      password: ''
    };
    vm.errorMes = "";

    vm.signIn = function() {
      console.log(vm.user);
      AuthService.login(vm.user)
        .then(function(success) {
          TokenService.setToken(success.data.token);
          $state.go('filter');
        }, function(error) {
          vm.errorMes = error.data.message;
        });

    }
  }

})();
