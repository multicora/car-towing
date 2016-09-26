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

      function checkUser(user, action) {
        // var length = user.roles.actions.length;
        // var i = 0;
        // for (; i < length; i++) {
        //   user.roles.actions[i] === action ? return true : return false;
        // }
        (user.roles === manager && action === 'see-manager-page') ? return true : return false;
        (user.roles === admin && action === 'see-admin-page') ? return true : return false;
        
        var answer = false;
        if (user.roles === 'admin' && action === 'see-admin-page') {
          answer = true;
        } else {
          if(user.roles === 'manager' && action === 'see-manager-page') {
            answer = true;
          } else {
            if(user.roles === 'user' && action === 'see-user-page') {
            answer = true;
          }
        }
        return answer;
      }
    }
})();