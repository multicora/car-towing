"use strict";

(function () {
  angular.module('app', ["ngRoute", "Autorisation"])
  .config(config);
		
	config.$inject = ["$routeProvider"];

  function config($routeProvider) {
    $routeProvider
      .when('/not-found', {
        template: '404'
      });
	}
})()