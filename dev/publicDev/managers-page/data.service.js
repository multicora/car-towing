'use strict';

(() => {
  angular
    .module('app')
    .factory("rulesDataService", dataservice);


    dataservice.$inject = ['$http'];

    function dataservice($http) {
      return {
        create: create,
        remove: remove,
        update: update,
        get: get
      };

      function get(propertyId) {
        return $http.get("/api/parkingRules/" + propertyId);
      }

      function create(propertyId, rule) {
        return $http.post("/api/parkingRules/" + propertyId, rule);
      }

      function update(id, rule) {
        return $http.put("/api/parkingRules/" + id, rule, {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }

      function remove(id) {
        return $http.delete("/api/parkingRules/" + id);
      }
    }
})();