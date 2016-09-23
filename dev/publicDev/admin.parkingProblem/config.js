'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when(
    '/admin/parking_problem',
    {
      templateUrl: 'admin.parkingProblem/admin.parkingProblem.html',
      controller: 'AdminParkingProblemController',
      controllerAs: 'vm'
    }
  );
}]);