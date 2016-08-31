'use strict';

(() => {
  angular
    .module('app')
    .factory("rulesDataService", dataservice);


    dataservice.$inject = ['$http'];

    function dataservice($http) {
      return {
        create: create,
        getAll: getAll,
        remove: remove
      };

      // TODO: for testing purpose
      function getAll() {
        return $http.get("/api/parkingRules");
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