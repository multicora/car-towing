(function() {
'use strict';
  angular
    .module('carTowingApp')
    .factory('TokenService', TokenService);

    TokenService.$inject = ['config'];

    function TokenService(config) {
      return {
        getToken: getToken,
        setToken: setToken,
        removeToken: removeToken,
      };

      function getToken() {
        return localStorage.getItem('cart.' + config.tokenName);
      }

      function setToken(token) {
        localStorage.setItem('cart.' + config.tokenName, token);
      }

      function removeToken() {
        return localStorage.removeItem('cart.' + config.tokenName);
      }
    }
})();
