'use strict';
(function(angular) {
var app = angular.module('app');

  app.
    config(['$routeProvider', 'resolverProvider', 'userActions', function($routeProvider, resolverProvider, userActions) {
    var resolver = resolverProvider.$get();

    $routeProvider.when(
      '/managers-page/add_decal',
      {
        templateUrl: 'decal/decalAdd.html',
        controller: 'managersCtrl as vm',
        resolve: {
          resolver: resolver.get()
        }
      }
    );
  }]);
})(angular);