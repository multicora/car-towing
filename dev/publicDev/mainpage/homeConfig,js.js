'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'mainpage/home.html'});
}]);