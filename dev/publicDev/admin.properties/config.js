'use strict';

(() => {
  angular.module('app')
    .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
      $routeProvider.when('/admin/properties', {
        templateUrl: 'admin.properties/tpl.html',
        controller: 'adminPropertiesCtrl',
        controllerAs: 'vm'
      });
    }
})();