"use strict";

(() => {
	angular
		.module('Autorisation')
    .controller("LoginController", LoginController);

    LoginController.$inject = ["DataService"];

    function LoginController(DataService) {
    	let vm = this;
    	vm.user = {
    		login: 'vadim@v.ua',
    		password: '1234'
    	};

    	vm.signIn = signIn;

    	function signIn() {
        console.log("sign in");
    		DataService.login(vm.user.login, vm.user.password)
    			.then((success) => {
            console.log(success);        
    			}, (error) => {
            console.error(error);
    			});
    	}
    }
})();
