'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('LoadingService', LoadingService);

    LoadingService.$inject = ['usSpinnerService'];

    function LoadingService(usSpinnerService) {
      var count = 0;

      return {
        showSpinner: showSpinner,
        hideSpinner: hideSpinner
      }

      function showSpinner() {
        usSpinnerService.spin('loading-spinner');
        count++;
      }

      function hideSpinner() {
        count--;

        if(count === 0) {
          usSpinnerService.stop('loading-spinner');
        }
      }
    }
})(angular);