'use strict';

(() => {
  angular
    .module('app')
    .factory("rulesDataService", dataservice);

    dataservice.$inject = ['$http', 'TokenService'];

    function dataservice($http, TokenService) {
      return {
        create: create,
        remove: remove,
        update: update,
        get: get
      };

      function get(propertyId) {
        return $http.get('/api/parkingRules/' + propertyId);
      }

      function create(propertyId, rule) {
        return $http.post('/api/parkingRules/' + propertyId + '?' + TokenService.getTokenName() + '=' + TokenService.getToken(), rule);
      }

      function update(id, rule) {
        return $http.put('/api/parkingRules/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken(), rule);
      }

      function remove(id) {
        return $http.delete('/api/parkingRules/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken());
      }
    }
})();