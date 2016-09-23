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
      unBlockUser: unBlockUser
    }

    function add(data) {
      return $http.post('api/users?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
    }

    function getUsers() {
      return $http.get('/api/users?' + TokenService.getTokenName() + '=' + TokenService.getToken());
    }

    function getUserById(id) {
      return $http.get('/api/users/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken());
    }

    function editUser(id, user) {
      return $http.put('/api/users/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken(), user);
    }

    function blockUser(id) {
      return $http.post('/api/user-block/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken());
    }

    function unBlockUser(id) {
      return $http.post('/api/user-unblock/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken());
    }
  }
})();