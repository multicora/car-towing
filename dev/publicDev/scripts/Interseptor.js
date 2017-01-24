'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('Interseptor', Interseptor);

    Interseptor.$inject = ['LoadingService', 'routingCheckingService', '$location'];

    function Interseptor(LoadingService, routingCheckingService, $location) {
      var loadingMessage = {
          request: function(request) {
            LoadingService.showSpinner();
            return request;
          },
          response: function(response) {
            LoadingService.hideSpinner();
            return response;
          },
          responseError: function(response) {
            LoadingService.hideSpinner();

            if (response.status == 401) {
              if (!routingCheckingService.checkRouting($location.url())) {
                $location.path('/login');
              }
            }
          }
      };
      return loadingMessage;
    }
})(angular);