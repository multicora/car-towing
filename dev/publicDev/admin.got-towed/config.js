'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', 'resolverProvider', function($routeProvider, resolverProvider) {
  var resolver = resolverProvider.$get();

  $routeProvider.when(
    '/admin/got_towed',
    {
      templateUrl: 'admin.got-towed/admin.got-towed.html',
      controller: 'AdminGotTowedController as vm',
      resolve: {
        resolver: resolver.get2('see-admin-page')
      }
    }
  );
}]);