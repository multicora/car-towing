'use strict';

(function(angular) {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider', 'resolverProvider', 'userAction'];

    function config($routeProvider, resolverProvider, userAction) {
      var resolver = resolverProvider.$get();

      $routeProvider.when('/admin/properties', {
        templateUrl: 'admin.properties/tpl.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userAction.SEE_ADMIN_PAGE)
        }
      })
      .when('/admin/properties/add', {
        templateUrl: 'admin.properties/propertyAdd.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userAction.SEE_ADMIN_PAGE)
        }
      });
    }
})(angular);