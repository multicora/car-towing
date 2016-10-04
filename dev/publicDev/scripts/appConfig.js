'use strict';

(function() {
  angular
    .module('app')
    .config(config);

    config.$inject = ['$httpProvider', '$routeProvider', 'TokenServiceProvider'];

    function config($httpProvider, $routeProvider, TokenServiceProvider) {
      $httpProvider.interceptors.push('LoadingService');
      console.log($httpProvider.interceptors);
      var TokenService = TokenServiceProvider.$get();
      $httpProvider.defaults.headers.common['X-CART-Token'] = TokenService.getToken();
      $httpProvider.defaults.withCredentials = true;
      $routeProvider.otherwise({ redirectTo: '/' });
      // $httpProvider.defaults.headers.common['X-CART-Token'] = TokenService.getToken();
    }
})();