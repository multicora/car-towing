'use strict';

(function() {
  var app = angular.module('app');

  app.service('resolver', customPageService);

  customPageService.$inject = ['$q', 'authService'];

  function customPageService($q, authService) {
    this.get = function () {
      return  $q(function (resolve) {
        authService.getCurrentUser().then(
          function (res) {
            authService.setUser(res.data);
            resolve();
          },
          function (errRes) {
            resolve();
          }
        );
      })
    }
  }
})();