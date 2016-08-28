'use strict';

app.factory('propertiesService', function($http) {
  return {
    getProperties: function() {
      return $http.get('api/properties');
    },
    getProperty: function(id) {
      return $http.get('api/property/' + id)
    },
    getRules: function(id) {
      return $http.get('/api/parkingRules/' + id)
    }
  };
});