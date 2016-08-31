'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when(
    '/properties',
    {
      templateUrl: 'properties/properties.html',
      controller: 'propertiesCtrl as vm'
    }
  );
}]);