'use strict';

(() => {
  angular
    .module('app')
    .factory("rulesDataService", dataservice);


    dataservice.$inject = ['$http'];

    function dataservice($http) {
      return {
        create: create,
        get: get,
        remove: remove
      };

      function get(propertyId) {
        return $http.get("/api/parkingRules/" + propertyId);
      }

      function create(propertyId, rule) {
        return $http.post("/api/parkingRules/" + propertyId, rule);
      }

      // TODO: future update functionality
      // function edit(id, rule) {
      //   return $http.put("/api/parkingRules/" + id, rule);
      // }

      function remove(id) {
        return $http.delete("/api/parkingRules/" + id);
      }
    }
})();