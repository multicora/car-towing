'use strict';

(function() {
  angular
    .module('Authorization')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['DataService', '$location', 'TokenService', '$http', '$routeParams'];

  function LoginController(DataService, $location, TokenService, $http, $routeParams) {
    var vm = this;
    
    vm.user = {
      login: '',
      password: ''
    };
    vm.passwordData = {
      newPassword: '',
      confirmPassword: '',
      resetToken: $routeParams.resetToken
    }
    vm.errorMes = '';
    vm.errorPassword = ''
    vm.signIn = signIn;
    vm.setNewPassword = setNewPassword;

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
    function setNewPassword() {
      DataService.newPassword(vm.passwordData).then(
        function(success) {
          $location.path('/');
          vm.errorPassword = '';
        }, 
        function(error) {
          vm.errorPassword = error.data.massage;
        }
      );
    }
  }
})();