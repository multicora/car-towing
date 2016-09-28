'use strict';

var app = angular.module('app');

app.
config(['$routeProvider','resolverProvider' , function($routeProvider, resolverProvider) {
  var resolver = resolverProvider.$get();
  $routeProvider.when(
    '/admin/parking_problem',
    {
      templateUrl: 'admin.parkingProblem/admin.parkingProblem.html',
      controller: 'AdminParkingProblemController',
      controllerAs: 'vm',
      resolve: {
        resolver: resolver.get('see-admin-page')
      }
    }
  );
}]);