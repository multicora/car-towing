'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('Interseptor', Interseptor);

    Interseptor.$inject = ['LoadingService'];

    function Interseptor(LoadingService) {
      var loadingMessage = {
          request: function(request) {
            LoadingService.showSpinner()
                return request;
          },
          response: function(response) {
            LoadingService.hideSpinner()
                return response;
          }
      };
      return loadingMessage;
    }
})(angular);