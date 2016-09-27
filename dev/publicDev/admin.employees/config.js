'use strict';

(function() {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider', 'resolverProvider'];

    function config($routeProvider, resolverProvider) {
      var resolver = resolverProvider.$get();

      $routeProvider.when('/admin/employees', {
        templateUrl: 'admin.employees/employees.html',
        controller: 'AdminEmployeesController',
        controllerAs: 'vm',
        resolve: {
          // resolver: resolver.get
          resolver: resolver.get2('action')
        }
      })
      .when('/admin/employees/edit', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userEditController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get
        }
      })
      .when('/admin/employees/edit/:id', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userEditController',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get
        }
      });
    }
})();