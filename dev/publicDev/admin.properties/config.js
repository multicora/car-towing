'use strict';

(function() {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider', 'resolverProvider'];

    function config($routeProvider, resolverProvider) {
      var resolver = resolverProvider.$get();

      $routeProvider.when('/admin/properties', {
        templateUrl: 'admin.properties/tpl.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get
        }
      })
      .when('/admin/properties/add', {
        templateUrl: 'admin.properties/propertyAdd.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get
        }
      });
    }
})();