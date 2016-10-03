'use strict';

(function(angular) {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider', 'resolverProvider', 'userAction'];

    function config($routeProvider, resolverProvider, userAction) {
      var resolver = resolverProvider.$get();

      $routeProvider.when('/admin/employees', {
        templateUrl: 'admin.employees/employees.html',
        controller: 'AdminEmployeesController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userAction.SEE_ADMIN_PAGE)
        }
      })
      .when('/admin/employees/edit', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userEditController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userAction.SEE_ADMIN_PAGE)
        }
      })
      .when('/admin/employees/edit/:id', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userEditController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userAction.SEE_ADMIN_PAGE)
        }
      });
    }
})(angular);