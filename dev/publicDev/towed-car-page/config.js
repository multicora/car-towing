'use strict';

// TODO: add IIFE
var app = angular.module('app');

app.
config(['$routeProvider', 'resolverProvider', function($routeProvider, resolverProvider) {
  var resolver = resolverProvider.$get();

  $routeProvider.when(
    '/towed_car',
    {
      templateUrl: 'towed-car-page/towed-car-page.html',
      controller: 'towedСarCtrl',
      controllerAs: 'vm',
      resolve: {
        resolver: resolver.get2()
      }
    }
  );
}]);