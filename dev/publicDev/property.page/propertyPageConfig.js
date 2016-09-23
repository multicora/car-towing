'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', 'resolverProvider', function($routeProvider, resolverProvider) {
  var resolver = resolverProvider.$get();

  $routeProvider.when('/property/:id', {
    templateUrl: 'property.page/propertyPage.html',
    controller: 'propertyCtrl as vm',
    resolve: {
      resolver: resolver.get
    }
  });
}]);