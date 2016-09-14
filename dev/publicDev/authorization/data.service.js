'use strict';

(function() {
  var app = angular.module('Authorization');

  app.factory('authService', dataservice);

  dataservice.$inject = ['$http'];

  function dataservice($http) {
    var user = null;

    return {
      login: login,
      newPassword: newPassword,
      setUser: setUser,
      getUser: getUser,
    };

    function login(user) {
      return $http.post("/api/login", user);
    }

    function newPassword(data) {
      return $http.post('api/new_password', data);
    }

    function setUser(newUser) {
      user = newUser;
    }

    function getUser(newUser) {
      return user;
    }
  }
})();