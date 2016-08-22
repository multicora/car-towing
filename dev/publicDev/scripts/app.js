"use strict";

(function () {
  angular.module('app', ["ui.router", "Autorisation"])
  .config(config);
		
	config.$inject = ["$stateProvider", "$urlRouterProvider"];

  function config($stateProvider, $urlRouterProvider) {
  	$urlRouterProvider.otherwise("/not-found");
    $stateProvider
      .state('notFound', {
          url: '/not-found',
          template: '404',
      })
      .state('login', {
          url: '/login',
          templateUrl: 'autorisation/login.html',
          controller: 'LoginController as vm'
        });
	}
})()