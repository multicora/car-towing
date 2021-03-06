'use strict';

(function(angular) {
  angular
    .module('app')
    .factory("UserCheckingService", UserCheckingService);


  UserCheckingService.$inject = ['$http'];

  function UserCheckingService($http) {
    return {
      checkUser: checkUser
    }

    function checkUser(user, roles, action) {
      var answer = false;
      if (user.roles) {
        var rolesMap = {};
        var usersActions = [];
        roles.forEach(function (roles) {
          rolesMap[roles.name] = roles;
        });
        user.roles.forEach(function (roles) {
          rolesMap[roles.name].actions.forEach(function (name, i) {
            usersActions = usersActions.concat(rolesMap[roles.name].actions[i].name);
          });
        });
        answer = usersActions.indexOf(action) >= 0;
      }
      return answer;
    }
  }
})(angular);