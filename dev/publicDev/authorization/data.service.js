'use strict';

(function() {
  angular
    .module('Authorization')
    .factory("DataService", dataservice);


    dataservice.$inject = ['$http'];

    function dataservice($http) {
      return {
        login: login,
        newPassword: newPassword
      };

      function login(user) {
        return $http.post("/api/login", user);
      }

      function newPassword(data) {
        return $http.post('api/new_password', data);
      }
    }
})();