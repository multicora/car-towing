'use strict';

(function() {
  var app = angular.module('app');

  app.service('resolver', service);

  service.$inject = ['$q', 'authService', 'UserCheckingService', '$location'];

  function service($q, authService, UserCheckingService, $location) {
    this.get2 = function (action) {
      return _.bind(this.get, this, action);
    };
    this.get = function () {
      return  $q(function (resolve) {
        Promise.all([authService.getCurrentUser(), authService.getRoles()]).then(
            function (res) {
              var user = res[0].data;
              var action = this;
              var roles = res[1].data;
              authService.setUser(res[0].data);

              if (!UserCheckingService.checkUser(user, roles, action)) {
                $location.path('/');
              }

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