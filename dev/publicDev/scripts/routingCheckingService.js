'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('routingCheckingService', routingCheckingService);


  routingCheckingService.$inject = ['$http'];

  function routingCheckingService($http) {
    return {
      checkRouting: checkRouting
    }

    function checkRouting(routing) {
      var routingArr = [];
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