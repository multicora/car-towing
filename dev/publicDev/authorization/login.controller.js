'use strict';

(function() {
  angular
    .module('Authorization')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    'authService',
    '$location',
    'TokenService',
    '$http',
    '$routeParams',
    'UserCheckingService'
  ];

  function LoginController(
    authService,
    $location,
    TokenService,
    $http,
    $routeParams,
    UserCheckingService
  ) {
    var vm = this;
    var urlPrev = $location.search().param;

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
    vm.errorPassword = '';
    vm.signIn = signIn;
    vm.setNewPassword = setNewPassword;

    function signIn() {
      authService.login(vm.user).then(
        function(success) {
          if (success && success.status === 200) {
            authService.setUser(success.data);
            TokenService.setToken(success.data.token);
            $http.defaults.headers.common['X-CART-Token'] = TokenService.getToken();
            authService.redirectByRole(success.data.roles);
            if (urlPrev) {
              $location.path(urlPrev).search('param', null);
            } else {
            }
            vm.errorMes = '';
          } else {
            vm.errorMes = 'The username or password is incorrect';
          }
        },
        function(error) {
          vm.errorMes = error.data.message;
        }
      );
    }

    function setNewPassword() {
      authService.newPassword(vm.passwordData).then(
        function(success) {
          $location.path('/');
          vm.errorPassword = '';
        }, 
        function(error) {
          vm.errorPassword = error.data.massage;
        }
      );
    }

    vm.resetPassword = function() {
      authService.resetPassword({email: vm.email}).then(
        function(success) {
          if(!success || success.status != 200) {
            vm.errorResetMessage = "User doesn't exists";
          } else {
            vm.errorResetMessage = "";
          }
        }
      );
    }
  }
})();