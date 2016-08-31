'use strict';

(() => {
  angular
    .module('app')
    .factory("rulesDataService", dataservice);


    dataservice.$inject = ['$http'];

    function dataservice($http) {
      return {
        create: create,
        getAll: getAll
      };

      // TODO: for testing purpose
      function getAll() {
        return $http.get("/api/parkingRules");
      }

      function create(rule) {
        return $http.post("/api/parkingRules/", rule);
      }
    }
})();