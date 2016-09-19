'use strict';

(function() {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
      $routeProvider.when('/admin/employees', {
        templateUrl: 'admin.employees/employees.html',
        controller: 'AdminEmployeesController',
        controllerAs: 'vm'
      })
      .when('/admin/employees/edit', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userDataBinding',
        controllerAs: 'vm'
      })
      .when('/admin/employees/edit/:id', {
        templateUrl: 'admin.employees/employeesAdd.html',
        controller: 'userDataBinding',
        controllerAs: 'vm'
      });
    }
})();