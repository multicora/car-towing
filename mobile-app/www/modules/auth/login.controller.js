(function () {
  'use strict';

  angular
    .module('carTowingApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['AuthService', '$state', 'TokenService', '$http'];

  function LoginController(AuthService, $state, TokenService, $http) {
    var vm = this;

    vm.user = {
      login: 'admin@admin.com',
      password: 'admin'
    };
    vm.errorMes = "";

    vm.signIn = function () {
      console.log(vm.user);
      AuthService.login(vm.user)
        .then(function (success) {
          TokenService.setToken(success.data.token, function () {
            $http.defaults.headers.common['X-CART-Token'] = TokenService.getToken();
            $state.go('locations');
          });
        }, function (error) {
          vm.errorMes = error.data.message;
        });

    }
  }

})();
