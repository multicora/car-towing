'use strict';

(function(angular) {
  var app = angular.module('app');

  app.service('resolver', service);

  service.$inject = ['$q', 'authService', 'UserCheckingService', '$location', 'TokenService'];

  function service($q, authService, UserCheckingService, $location, TokenService) {
    this.get = function (action) {
      return _.bind(function () {
        return resolve(action);
      }, this);
    };
    function resolve (action) {
      return  $q(function (resolve) {
        if (TokenService.getToken()) {
          Promise.all([authService.getCurrentUser(), authService.getRoles()]).then(
              function (res) {
                var user = res[0].data;
                var roles = res[1].data;
                authService.setUser(res[0].data);

                if (action && !UserCheckingService.checkUser(user, roles, action)) {
                  $location.path('/');
                }
                resolve();
              },
              function (errRes) {
                resolve();
              }
          );
        }
      })
    };
  }
})(angular);