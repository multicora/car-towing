'use strict';

(function() {
  var app = angular.module('app');

  app.service('resolver', service);

  service.$inject = ['$q', 'authService', 'UserCheckingService', '$location'];

  function service($q, authService, UserCheckingService, $location) {
    this.get2 = function (action) {
      return _.bind(function () {
        return resolve(action);
      }, this);
    };
    this.get = function () {
      return _.bind(function () {
        return resolve();
      }, this);
    };
    function resolve (action) {
      return  $q(function (resolve) {
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
      })
    };
  }
})();