'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('Interseptor', Interseptor);

    Interseptor.$inject = ['LoadingService', '$location'];

    function Interseptor(LoadingService, $location) {
      var loadingMessage = {
          request: function(request) {
            LoadingService.showSpinner()
                return request;
          },
          response: function(response) {
            LoadingService.hideSpinner()
                return response;
          },
          responseError: function(response) {
            if (response.status == 401) {
              LoadingService.hideSpinner();
                $location.path('/login');
            }
          }
      };
      return loadingMessage;
    }
})(angular);