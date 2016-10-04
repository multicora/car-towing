'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('LoadingService', LoadingService);

    LoadingService.$inject = [];

    function LoadingService() {
      var loadingMessage = {
          request: function() {
            console.log('request');
          },
          response: function() {
            console.log('response');
          }
      };
      return loadingMessage;
    }
})(angular);