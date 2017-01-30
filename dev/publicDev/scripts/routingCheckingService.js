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

      var reg = new RegExp("^\/login|^\/properties|^\/parking_problem" +
        + "|^\/towed_car|^\/complaint|^\/property\/|^\/$", "g");
      console.log(routing);
      return routing.match(reg);
    }
  }
})(angular);