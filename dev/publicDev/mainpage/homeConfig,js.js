'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', 'resolverProvider', function($routeProvider, resolverProvider) {
  var resolver = resolverProvider.$get();

  $routeProvider.when('/',
    {
      templateUrl: 'mainpage/home.html',
      resolve: {
        resolver: resolver.get
      }
    }
  );
}]);