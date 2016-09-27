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

      function checkUser(user, action, actions) {
        for (var i = 0; i < actions.length; i++) {
          if (actions[i].name === user) {
            var answer = actions[i].actions.indexOf(action) >= 0; 
          }
        }
        console.log(answer);
        return answer;
      }
    }
})();