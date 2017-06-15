'use strict';

(function() {
  angular
    .module('Authorization')
    .factory('TokenService', TokenService);

    TokenService.$inject = [];

    function TokenService() {
      return {
        getToken: getToken,
        setToken: setToken,
        removeToken: removeToken,
        getTokenName: function () {
          return 'X-CART-Token';
        }
      };

      function getToken() {
        return localStorage.getItem('cart.X-CART-Token');
      }

      function setToken(token) {
        localStorage.setItem('cart.X-CART-Token', token);
      }

      function removeToken() {
        return localStorage.removeItem('cart.X-CART-Token');
      }
    }
})();
