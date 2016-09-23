'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', 'resolverProvider', function($routeProvider, resolverProvider) {
  var resolver = resolverProvider.$get();

  $routeProvider.when(
    '/properties',
    {
      templateUrl: 'properties/properties.html',
      controller: 'propertiesCtrl as vm',
      resolve: {
        resolver: resolver.get
      }
    }
  );
}]);