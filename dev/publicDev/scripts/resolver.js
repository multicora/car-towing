'use strict';

(function() {
  var app = angular.module('app');

  app.service('resolver', customPageService);

  customPageService.$inject = ['$q', 'authService', 'TokenService'];

  function customPageService($q, authService, TokenService) {
    this.get = function () {
      return  $q(function (resolve) {
        if (TokenService.getToken()) {
          authService.getCurrentUser().then(
            function (res) {
              authService.setUser(res.data);
              resolve();
            },
            function (errRes) {
              resolve();
            }
          );
        }
      })
    }
  }
})();