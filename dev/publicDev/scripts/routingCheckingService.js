'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('routingCheckingService', routingCheckingService);

  function routingCheckingService() {
    return {
      checkRouting: checkRouting
    }

    function checkRouting(routing) {
      var routingArr = [
        '/login',
        '/',
        '/properties',
        '/parking_problem',
        '/towed_car',
        '/complaint'
      ];

      var result;

      if (routingArr.indexOf(routing) >= 0) {
        result = true;
      } else {
        result = false;
      };

      return result;
    }
  }
})(angular);