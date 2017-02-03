'use strict';

service.$inject = ['$http', 'TokenService'];
function emergencyTowingService ($http, TokenService) {
  return {
    getEmergencyTowing: function() {
      return $http.get('/api/emergency_towing', {
          headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }
  };
}

app.factory('emergencyTowingService', emergencyTowingService);