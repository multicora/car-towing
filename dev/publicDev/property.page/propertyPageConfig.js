'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/property:id', {
    templateUrl: 'property.page/propertyPage.html',
    controller: 'propertyCtrl as vm'
  });
}]);