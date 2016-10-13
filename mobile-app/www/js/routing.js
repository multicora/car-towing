(function(){
  'use strict';

  angular.module('carTowingApp')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'modules/auth/login.tmpl.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('filter', {
        url: '/filter',
        templateUrl: 'modules/filter/filter.tmpl.html',
        controller: 'FilterController',
        controllerAs: 'vm'
      })
      .state('properties', {
        url: '/properties/:title',
        templateUrl: 'modules/properties/properties.tmpl.html',
        controller: 'PropertiesController',
        controllerAs: 'vm'
      });

      $urlRouterProvider.otherwise('/filter');
  }
})();
