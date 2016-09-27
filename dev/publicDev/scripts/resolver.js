'use strict';

(function() {
  var app = angular.module('app');

  app.service('resolver', customPageService);

  customPageService.$inject = ['$q', 'authService', 'UserCheckingService'];

  function customPageService($q, authService, UserCheckingService) {
    this.get = function () {
      return  $q(function (resolve) {
        Promise.all([authService.getCurrentUser(), authService.getRoles()]).then(
            function (res) {
              var user = res[0].data.roles[0].name;
              var action = res[0].data.roles[0].actions;
              var actions = res[1].data;
              authService.setUser(res[0].data);
              UserCheckingService.checkUser(user, action, actions);
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