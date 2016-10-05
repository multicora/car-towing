'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('LoadingService', LoadingService);

    LoadingService.$inject = ['usSpinnerService'];

    function LoadingService(usSpinnerService) {
      var loadingMessage = {
          request: function(request) {
            return request;
          },
          response: function(response) {
            usSpinnerService.stop('loading-spinner');
            return response;
          }
      };
      return loadingMessage;
    }
})(angular);