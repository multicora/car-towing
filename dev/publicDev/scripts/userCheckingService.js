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
        var map = {
          admin: ['see-admin-page'],
          manager: ['see-manager-page']
        };
        for (var key in map) {
          if (key === user.role) {
            var answer = map[key].indexOf(action) >= 0;
          }
        }
        return answer;
      }
    }
})();