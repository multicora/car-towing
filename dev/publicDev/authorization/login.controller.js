"use strict";

(() => {
	angular
		.module('Autorisation')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['DataService', '$location'];

    function LoginController(DataService, $location) {
    	let vm = this;
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
