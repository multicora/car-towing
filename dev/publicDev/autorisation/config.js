'use strict';

(function() {
	angular
		.module('Autorisation')
    .config(config);
		
		config.$inject = ['$stateProvider'];

    function config($stateProvider) {
      $stateProvider
        .state('login', {
                url: '/login',
                templateUrl: 'autorisation/login.html',
                controller: "LoginController as vm"
            });
  	}

})();