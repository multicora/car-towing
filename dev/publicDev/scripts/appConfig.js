'use strict';

(function() {
  angular
    .module('app')
    .config(config);

    config.$inject = ['$httpProvider', '$routeProvider', 'TokenServiceProvider'];

    function config($httpProvider, $routeProvider, TokenServiceProvider) {
      var TokenService = TokenServiceProvider.$get();
      $routeProvider.otherwise({ redirectTo: '/' });
      $httpProvider.defaults.headers.common['X-CART-Token'] = TokenService.getToken();
    }
})();