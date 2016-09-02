'use strict';

(() => {
	angular
		.module('Autorisation', ['ngRoute'])
		.config(config);
		
		config.$inject = ['$routeProvider'];

    function config($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'authorization/login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        })
        .when('/reset', {
          templateUrl: 'authorization/resetPassword.html',
          controller: 'LoginController as vm'
        })
        .when('/new_password/:token', {
          templateUrl: 'authorization/newPassword.html',
          controller: 'LoginController as vm'
        });
  	}
})();