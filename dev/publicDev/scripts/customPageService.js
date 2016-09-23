'use strict';

(function() {
  angular
    .module('app')
    .factory("customPageService", customPageService);


    customPageService.$inject = ['$http', 'TokenService'];

    function customPageService($http, TokenService) {
      return {
        getGotTowed: getGotTowed,
        getParkingProblem: getParkingProblem,
        saveGotTowed: saveGotTowed,
        saveParkingProblem: saveParkingProblem
      }

      function saveGotTowed(data) {
        return $http.post('api/gotTowed?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
      }

      function saveParkingProblem(data) {
        return $http.post('api/parkingProblem?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
      }

      function getGotTowed() {
        return $http.get('api/gotTowed');
      }

      function getParkingProblem() {
        return $http.get('api/parkingProblem');
      }
    }
})();