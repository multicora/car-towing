'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {templateUrl: 'menu/menu.html'});
}]);