'use strict';

(function() {
  angular
    .module('app')
    .factory("UserCheckingService", UserCheckingService);


    UserCheckingService.$inject = ['$http'];

    function UserCheckingService($http) {
      return {
        checkUser: checkUser
      }

      function checkUser(user, roles, action) {
        var rolesMap = {};
        var usersActions = [];
        roles.forEach(function (roles) {
          rolesMap[roles.name] = roles;
        });
        user.roles.forEach(function (roles) {
          usersActions = usersActions.concat(rolesMap[roles.name].actions[0].name);
        });
        var answer = usersActions.indexOf(action) >= 0;
        return answer;
      }
    }
})();