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
        console.log(roles);
        for (var i = 0; i < roles.length; i++) {
          if (roles[i].name === user.name) {
            console.log(roles[i].actions, action);
            var answer = roles[i].actions.indexOf(action) >= 0; 
          }
        }
        console.log(answer);
        return answer;
      }
    }
})();