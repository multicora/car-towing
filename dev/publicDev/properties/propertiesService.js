'use strict';

service.$inject = ['$http', 'TokenService'];
function service ($http, TokenService) {
  return {
    getProperties: function() {
      return $http.get('api/properties');
    },
    getProperty: function(id) {
      return $http.get('api/property/' + id);
    },
    getRules: function(id) {
      return $http.get('/api/parkingRules/' + id);
    },
    create: function(data) {
      return $http.post('/api/property?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
    },
    getUsersProperty: function(userId) {
      return $http.get('/api/user-property/' + userId);
    }
  };
}

app.factory('propertiesService', service);