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
        removeToken: removeToken 
      };

      function getToken() {
        return localStorage.getItem('X-CART-Token');
      }

      function setToken(token) {
        localStorage.setItem('X-CART-Token', token);
      }

      function removeToken() {
        return localStorage.removeItem('X-CART-Token');
      }
    }
})();
