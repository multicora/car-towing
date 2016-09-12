'use strict';

(function() {
  angular
    .module('app')
    .factory("AdminGotTowedService", AdminGotTowedService);


    AdminGotTowedService.$inject = ['$http'];

    function AdminGotTowedService($http) {
      return {
        send: send
      }

      function send(data) {
        return $http.post('api/gotTowed', data);
      }
    }
})();