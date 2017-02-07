'use strict';

(function() {
  angular
    .module('Authorization')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['authService', '$location', 'TokenService', '$http', '$routeParams'];

  function LoginController(authService, $location, TokenService, $http, $routeParams) {
    var vm = this;
    var urlPrev = $routeParams.url_prev || '/';

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
            redirectByRole(success.data.roles, urlPrev);
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

    function redirectByRole(roles, url) {
      var map = {
        'admin': '/admin',
        'property-manager': '/managers-page'
      };
      var pathArray = roles.map(function (role) {
        return role.name;
      }).map(function (name) {
        return map[name];
      }).filter(function (mapRole) {
        return mapRole;
      });

      if (pathArray.length > 0) {
        $location.path(pathArray[0]);
      } else {
        $location.path(url);
      }
    }
  }
})();