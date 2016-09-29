'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', 'resolverProvider', function($routeProvider, resolverProvider) {
  var resolver = resolverProvider.$get();

  $routeProvider.when(
    '/complaint',
    {
      templateUrl: 'complaint/complaint.html',
      controller: 'complaintCtrl as vm',
      resolve: {
        resolver: resolver.get
      }
    }
  );
}]);