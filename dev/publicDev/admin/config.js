'use strict';

(() => {
  angular.module('app').config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider.when('/admin', { redirectTo: '/admin/properties' });
  }
})();