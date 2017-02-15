'use strict';
(function(angular) {
var app = angular.module('app');

  app.
    config(['$routeProvider', 'resolverProvider', 'userActions', function($routeProvider, resolverProvider, userActions) {
    var resolver = resolverProvider.$get();

    $routeProvider.when('/managers-page/add_decal', {
      templateUrl: 'decal/decalAdd.html',
      controller: 'decalController as vm',
      resolve: {
        resolver: resolver.get(userActions.SEE_MANAGER_PAGE, '/managers-page/add_decal')
      }
    })
    .when('/managers-page/add_decal/:id', {
      templateUrl: 'decal/decalAdd.html',
      controller: 'decalController as vm',
      resolve: {
        resolver: resolver.get(userActions.SEE_MANAGER_PAGE, '/managers-page/add_decal/:id')
      }
    });
  }]);
})(angular);