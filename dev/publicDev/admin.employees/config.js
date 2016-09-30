'use strict';

(function(angular) {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider', 'resolverProvider'];

    function config($routeProvider, resolverProvider) {
      var resolver = resolverProvider.$get();
      var action = 'see-admin-page';

      $routeProvider.when('/admin/employees', {
        templateUrl: 'admin.employees/employees.html',
        controller: 'AdminEmployeesController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(action)
        }
      })
      .when('/admin/employees/edit', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userEditController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(action)
        }
      })
      .when('/admin/employees/edit/:id', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userEditController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(action)
        }
      });
    }
})(angular);