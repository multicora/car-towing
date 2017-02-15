'use strict';

(function() {
  var app = angular.module('Authorization');

  app.factory('authService', dataservice);

  dataservice.$inject = ['$http', 'TokenService', '$location'];

  function dataservice($http, TokenService, $location) {
    var user = null;

    return {
      login: login,
      newPassword: newPassword,
      getCurrentUser: getCurrentUser,
      setUser: setUser,
      getUser: getUser,
      getRoles: getRoles,
      resetPassword: resetPassword,
      redirectByRole: redirectByRole
    };

    function login(user) {
      return $http.post("/api/login", user);
    }

    function newPassword(data) {
      return $http.post('api/new_password', data);
    }

    function resetPassword(data) {
      return $http.post('/api/reset_password', data);
    }

    function getCurrentUser() {
      return $http.get('api/currentUser', {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
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

    function redirectByRole(roles) {
      var map = {
        'admin': '/admin',
        'property-manager': '/managers-page'
      };
      var pathArray = roles.map(function (role) {
        return role.name;
      }).map(function (name) {
        return map[name];
      }).filter(function (mapRole) {
        return mapRole;
      });

      console.log(pathArray, 'pathArray');
      if (pathArray.length > 0) {
        $location.path(pathArray[0]);
      } else {
        $location.path('/').search('param', null);
      }
    }
  }
})();