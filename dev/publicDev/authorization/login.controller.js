'use strict';

(function() {
  angular
    .module('Authorization')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['DataService', '$location', 'TokenService', '$http', '$routeParams'];

  function LoginController(DataService, $location, TokenService, $http, $routeParams) {
    var vm = this;
    var resetToken = $routeParams.resetToken;

    vm.user = {
      login: '',
      password: ''
    };
    vm.newPassword = '';
    vm.confirmPassword = '';
    vm.errorMes = '';
    vm.errorPassword = ''
    vm.signIn = signIn;
    vm.setPassword = setPassword;

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
    function setPassword() {
      DataService.newPassword(resetToken, vm.newPassword, vm.confirmPassword)
        .then(function(success) {
          $location.path('#/home');
          }, function(error) {
            vm.errorPassword = error.data.massage;
          });
      }
  }
})();
