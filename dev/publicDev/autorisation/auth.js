'use strict';

(() => {
	angular
		.module('Autorisation', ['ngRoute'])
		.config(config);
		
		config.$inject = ['$routeProvider'];

    function config($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'autorisation/login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        });
      /*$stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'autorisation/login.html',
          controller: 'LoginController as vm'
      	});*/
  	}
})();