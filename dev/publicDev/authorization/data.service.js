'use strict';

(function() {
  var app = angular.module('Authorization');

  app.factory('authService', dataservice);

  dataservice.$inject = ['$http', 'TokenService'];

  function dataservice($http, TokenService) {
    var user = null;

    return {
      login: login,
      newPassword: newPassword,
      getCurrentUser: getCurrentUser,
      setUser: setUser,
      getUser: getUser,
      getRoles: getRoles
    };

    function login(user) {
      return $http.post("/api/login", user);
    }

    function newPassword(data) {
      return $http.post('api/new_password', data);
    }

    function getCurrentUser() {
      return $http.get('api/currentUser?' + TokenService.getTokenName() + '=' + TokenService.getToken());
    }

    function setUser(newUser) {
      user = newUser;
    }

    function getUser(newUser) {
      return user;
    }

    function getRoles() {
      return $http.get('api/roles');
    }
  }
})();