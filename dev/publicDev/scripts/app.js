"use strict";

(function () {
  angular.module('app', ["ngRoute", "Autorisation"])
  .config(config);
		
	config.$inject = ["$routeProvider"];

  function config($routeProvider) {
  	//$urlRouterProvider.otherwise("/not-found");

    $routeProvider
      .when('/not-found', {
        template: '404'
      });
	}
})()