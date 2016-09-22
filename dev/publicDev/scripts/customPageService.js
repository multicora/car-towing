'use strict';

(function() {
  angular
    .module('app')
    .factory("customPageService", customPageService);


    customPageService.$inject = ['$http', 'TokenService'];

    function customPageService($http, TokenService) {
      return {
        get: get,
        saveGotTowed: saveGotTowed,
        saveParkingProblem: saveParkingProblem
      }

      function saveGotTowed(data) {
        return $http.post('api/gotTowed?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
      }

      function saveParkingProblem(data) {
        return $http.post('api/parkingProblem?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
      }

      function get() {
        return $http.get('api/gotTowed');
      }
    }
})();