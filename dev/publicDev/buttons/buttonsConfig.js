'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/buttons', {templateUrl: 'buttons/buttons.html'});
}]);