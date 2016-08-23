'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/property', {templateUrl: 'property.page/propertyPage.html'});
}]);