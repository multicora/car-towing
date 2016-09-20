'use strict';

(function() {
  angular
    .module('app')
    .factory("AdminEmployeesService", AdminEmployeesService);


    AdminEmployeesService.$inject = ['$http','TokenService'];

    function AdminEmployeesService($http, TokenService) {
      return {
        add: add,
        getUsers: getUsers,
        getUserById: getUserById,
        editUser: editUser
      }

      function add(data) {
        return $http.post('api/users?' + TokenService.getTokenName() + '=' + 'heeGZWmTN8qtkEUt', data);
        // return $http.post('api/users?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
      }

      function getUsers() {
        return $http.get('/api/users?' + TokenService.getTokenName() + '=' + 'heeGZWmTN8qtkEUt');
        // return $http.get('/api/users?' + TokenService.getTokenName() + '=' + TokenService.getToken());
      }

      function getUserById(id) {
        return $http.get('/api/users/' + id + '?' + TokenService.getTokenName() + '=' + 'heeGZWmTN8qtkEUt', id);
        // return $http.get('/api/users/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken(), id);
      }

      function editUser(id, user) {
        return $http.put("/api/users/" + id, user, {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }
    }
})();