'use strict';

app.factory('propertyService', function($http) {
  return {
    getProperty: function(id) {
      return $http.get('api/properties/' + id)
    },
    getRules: function(id) {
      return $http.get('/api/parkingRules/' + id)
    }
  }
});