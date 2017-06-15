'use strict';

(function() {
  angular.module('app').factory("AdminEmployeesService", AdminEmployeesService);

  AdminEmployeesService.$inject = ['$http', 'TokenService'];

  function AdminEmployeesService($http, TokenService) {
    return {
      add: add,
      getUsers: getUsers,
      getUserById: getUserById,
      editUser: editUser,
      blockUser: blockUser,
      unBlockUser: unBlockUser,
      getDrivers: getDrivers
    }

    function add(data) {
      return $http.post('api/drivers', data, {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }

    function getUsers() {
      return $http.get('/api/users', {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }

    function getDrivers() {
      return $http.get('/api/drivers', {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }

    function getUserById(id) {
      return $http.get('/api/users/' + id, {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }

    function editUser(id, user) {
      return $http.put('/api/users/' + id, user, {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }

    function blockUser(id) {
      return $http.get('/api/user-block/' + id, {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }

    function unBlockUser(id) {
      return $http.get('/api/user-unblock/' + id, {
        headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }
  }
})();