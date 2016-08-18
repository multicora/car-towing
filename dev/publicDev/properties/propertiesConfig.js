'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/properties', {templateUrl: 'public/properties/properties.html', controller: 'propertiesCtrl'});
}]);