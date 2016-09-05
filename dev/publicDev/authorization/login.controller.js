"use strict";

(() => {
  angular
    .module('Autorisation')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['DataService', '$location', '$routeParams'];

    function LoginController(DataService, $location, $routeParams) {
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
      vm.newPasswordFunc = newPasswordFunc;

      function signIn() {
        DataService.login(vm.user)
          .then((success) => {
            console.log(success);
            /*TODO: save token in local storage*/ 
            //$location.path('/home');
            //console.log('success');
            vm.errorMes = '';
          }, (error) => {
            vm.errorMes = error.data.message;
            //console.error(vm.errorMes);
          });
      }

      function newPasswordFunc() {
        if (vm.newPassword == vm.confirmPassword) {
          DataService.newPassword(vm.newPassword, resetToken)
            .then((success) => {
              $location.path('/home');
            }, (error) => {
              vm.errorPassword = error.data.massage;
            });
          } else {
            vm.errorPassword = 'Incorrect password.';
        }
      }
    }
})();
