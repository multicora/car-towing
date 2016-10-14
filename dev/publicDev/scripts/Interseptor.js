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
              .then(function(success) {
                return request;
              }, function(err) {
                console.log(err);
              });
          },
          response: function(response) {
            LoadingService.hideSpinner()
              .then(function(success) {
                return response;
              }, function(err) {
                console.log(err);
              });
          }
      };
      return loadingMessage;
    }
})(angular);