'use strict';

(function() {
  angular
    .module('app')
    .factory("rulesDataService", dataservice);

    dataservice.$inject = ['$http', 'TokenService'];

    function dataservice($http, TokenService) {
      return {
        create: create,
        remove: remove,
        update: update,
        get: get,
        blocking: blocking,
        getBlocking: getBlocking,
        unblocking: unblocking,
        updateBlocking: updateBlocking
      };

      function blocking(data, propertyId) {
        return $http.post('api/blocking/' + propertyId, data, {
            headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
          }
        );
      }

      function updateBlocking(data, id) {
        return $http.put('api/blocking/' + id, data, {
            headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
          }
        );
      }

      function getBlocking(propertyId) {
        return $http.get('api/blocking/' + propertyId, {
            headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
          }
        );
      }

      function unblocking(id) {
        return $http.delete('api/unblocking/' + id, {
            headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
          }
        );
      }

      function get(propertyId) {
        return $http.get('/api/parkingRules/' + propertyId);
      }

      function create(propertyId, rule) {
        return $http.post('/api/parkingRules/' + propertyId, rule, {
            headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
          }
        );
      }

      function update(id, rule) {
        return $http.put('/api/parkingRules/' + id, rule, {
            headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
          }
        );
      }

      function remove(id) {
        return $http.delete('/api/parkingRules/' + id, {
            headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
          }
        );
      }
    }
})();