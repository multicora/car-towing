'use strict';

(function() {
  angular
    .module('Authorization')
    .factory("DataService", dataservice);


    dataservice.$inject = ['$http'];

    function dataservice($http) {
      return {
        login: login,
        log
      };

      function login(user) {
        return $http.post("/api/login", user);
      }
    }
})();