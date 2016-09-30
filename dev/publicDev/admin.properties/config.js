'use strict';

(function(angular) {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider', 'resolverProvider'];

    function config($routeProvider, resolverProvider) {
      var resolver = resolverProvider.$get();
      var action = 'see-admin-page';

      $routeProvider.when('/admin/properties', {
        templateUrl: 'admin.properties/tpl.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(action)
        }
      })
      .when('/admin/properties/add', {
        templateUrl: 'admin.properties/propertyAdd.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(action)
        }
      });
    }
})(angular);