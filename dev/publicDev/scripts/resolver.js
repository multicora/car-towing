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
        $q.all([authService.getCurrentUser(), authService.getRoles()]).then(
          function (res) {
            var user = res[0].data;
            var roles = res[1].data;
            authService.setUser(res[0].data);

            if (action && !UserCheckingService.checkUser(user, roles, action)) {
              console.log('User do not have action "' + action + '"');
              // $location.path('/login');
            }
            resolve();
          },
          function (errRes) {
            resolve();
          }
        );
      })
    };
  }
})(angular);