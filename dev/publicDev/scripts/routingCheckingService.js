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
      var i = 0;
      var result = false;
      var routingArr = [
        '/login',
        '/',
        '/properties',
        '/parking_problem',
        '/towed_car',
        '/complaint',
        '/property/'
      ];

      for (; i < routingArr.length; i++) {
        if (routing.indexOf(routingArr[i]) >= 0) {
          result = true;
          break;
        }
      }
      return result;
    }
  }
})(angular);