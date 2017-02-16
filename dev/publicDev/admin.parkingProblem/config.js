'use strict';
(function(angula) {
  var app = angular.module('app');

  app.
    config(['$routeProvider','resolverProvider', 'userActions' , function($routeProvider, resolverProvider, userActions) {
    var resolver = resolverProvider.$get();
    $routeProvider.when(
      '/admin/parking_problem',
      {
        templateUrl: 'admin.parkingProblem/admin.parkingProblem.html',
        controller: 'AdminParkingProblemController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userActions.SEE_ADMIN_PAGE, /^\/admin\/parking_problem/)
        }
      }
    );
  }]);
})(angular);