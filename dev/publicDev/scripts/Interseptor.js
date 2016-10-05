'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('LoadingService', LoadingService);

    LoadingService.$inject = [];

    function LoadingService() {
      var loadingMessage = {
          request: function(request) {
            console.log('request');
            return request;
          },
          response: function(response) {
            console.log('response');
            return response;
          }
      };
      return loadingMessage;
    }
})(angular);