'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'mainpage/home.html'});
}]);