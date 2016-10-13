'use strict';

(function(angular) {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider', 'resolverProvider', 'userActions'];

    function config($routeProvider, resolverProvider, userActions) {
      var resolver = resolverProvider.$get();

      $routeProvider.when('/admin/properties', {
        templateUrl: 'admin.properties/tpl.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userActions.SEE_ADMIN_PAGE)
        }
      })
      .when('/admin/properties/add', {
        templateUrl: 'admin.properties/propertyAdd.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userActions.SEE_ADMIN_PAGE)
        }
      })
      .when('/admin/properties/edit/:id', {
        templateUrl: 'admin.properties/propertyAdd.html',
        controller: 'adminPropertiesEditCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userActions.SEE_ADMIN_PAGE)
        }
      });
    }
})(angular);