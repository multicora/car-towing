'use strict';
(function(angula) {
  var app = angular.module('app');

  app.
    config(['$routeProvider','resolverProvider', 'userAction' , function($routeProvider, resolverProvider,userAction) {
    var resolver = resolverProvider.$get();
    $routeProvider.when(
      '/admin/parking_problem',
      {
        templateUrl: 'admin.parkingProblem/admin.parkingProblem.html',
        controller: 'AdminParkingProblemController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userAction.SEE_ADMIN_PAGE)
        }
      }
    );
  }]);
})(angular);