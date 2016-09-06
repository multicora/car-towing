'use strict';

(function() {
  angular
    .module('Authorization')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['DataService', '$location', 'TokenService', '$http'];

  function LoginController(DataService, $location, TokenService, $http) {
    var vm = this;
    vm.user = {
      login: '',
      password: ''
    };
    vm.errorMes = '';

    vm.signIn = signIn;
    vm.logout = logout;

    function signIn() {
      DataService.login(vm.user)
        .then(function(success) {
          TokenService.setToken(success.data['X-CART-Token']);
          $http.defaults.headers.common['X-CART-Token'] = TokenService.getToken('X-CART-Token');
          $location.path('/');
          vm.errorMes = '';
        }, function(error) {
          vm.errorMes = error.data.message;
        });
    }
    function logout() {
      TokenService.removeToken();
      $location.path('/');
    }
  }
})();
