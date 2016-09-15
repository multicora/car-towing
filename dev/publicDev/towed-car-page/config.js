'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when(
    '/towed_car',
    {
      templateUrl: 'towed-car-page/towed-car-page.html',
      controller: 'towedСarCtrl as vm'
    }
  );
}]);