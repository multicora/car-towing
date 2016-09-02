"use strict";

(() => {
  angular
    .module('Autorisation')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['DataService', '$location', '$routeParams'];

    function LoginController(DataService, $location, $routeParams) {
      let vm = this;
      let passwordToken = $routeParams.token;

      vm.user = {
        login: '',
        password: ''
      };
      vm.errorMes = '';
      vm.signIn = signIn;

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
    }
})();
