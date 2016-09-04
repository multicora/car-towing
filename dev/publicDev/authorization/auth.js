'use strict';

(function() {
  angular
    .module('Authorization', ['ngRoute'])
    .config(config);
    
    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'authorization/login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        });
    }
})();