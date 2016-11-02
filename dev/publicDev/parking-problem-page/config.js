'use strict';

(function(angular) {
  var app = angular.module('app');

  app.
    config(['$routeProvider', 'resolverProvider', function($routeProvider, resolverProvider) {
    var resolver = resolverProvider.$get();

    $routeProvider.when(
      '/parking_problem',
      {
        templateUrl: 'parking-problem-page/parking-problem-page.html',
        controller: 'parkingProblemPageCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get()
        }
      }
    );
  }]);
})(angular);