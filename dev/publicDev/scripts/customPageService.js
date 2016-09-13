'use strict';

(function() {
  angular
    .module('app')
    .factory("AdminGotTowedService", AdminGotTowedService);


    AdminGotTowedService.$inject = ['$http'];

    function AdminGotTowedService($http) {
      return {
        save: save,
        get: get
      }

      function save(data) {
        return $http.post('api/gotTowed', data);
      }

      function get() {
        return $http.get('api/gotTowed');
      }
    }
})();