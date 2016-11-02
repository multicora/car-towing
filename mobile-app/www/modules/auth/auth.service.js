(function() {
  'use strict';

  angular.module('carTowingApp')
    .factory('AuthService', AuthService);

  AuthService.$inject = ['config', '$http'];

  function AuthService(config, $http) {
    return {
      login: login
    };

    function login(user) {
      return $http.post(config.url + "/api/login", user);
    }
  }

})();