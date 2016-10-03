'use strict';
(function(angular) {
var app = angular.module('app');

  app.
    config(['$routeProvider', 'resolverProvider', 'userAction', function($routeProvider, resolverProvider, userAction) {
    var resolver = resolverProvider.$get();

    $routeProvider.when(
      '/admin/got_towed',
      {
        templateUrl: 'admin.got-towed/admin.got-towed.html',
        controller: 'AdminGotTowedController as vm',
        resolve: {
          resolver: resolver.get(userAction.SEE_ADMIN_PAGE)
        }
      }
    );
  }]);
})(angular);