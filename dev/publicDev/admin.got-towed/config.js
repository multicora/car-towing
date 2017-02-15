'use strict';
(function(angular) {
var app = angular.module('app');

  app.
    config(['$routeProvider', 'resolverProvider', 'userActions', function($routeProvider, resolverProvider, userActions) {
    var resolver = resolverProvider.$get();

    $routeProvider.when(
      '/admin/got_towed',
      {
        templateUrl: 'admin.got-towed/admin.got-towed.html',
        controller: 'AdminGotTowedController as vm',
        resolve: {
          resolver: resolver.get(userActions.SEE_ADMIN_PAGE, '/admin/got_towed')
        }
      }
    );
  }]);
})(angular);