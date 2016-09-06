'use strict';

(() => {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
      // $routeProvider.when('/admin/properties', {
      //   templateUrl: 'admin.properties/tpl.html',
      //   controller: 'adminPropertiesCtrl',
      //   controllerAs: 'vm'
      // })
      // .when('/admin/properties/add', {
      //   templateUrl: 'admin.properties/propertyAdd.html',
      //   controller: 'adminPropertiesCtrl',
      //   controllerAs: 'vm'
      // });
    }
})();