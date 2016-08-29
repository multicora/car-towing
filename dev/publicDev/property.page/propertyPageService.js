'use strict';

app.factory('propertyService', function($http) {
  return {
    getProperty: function(id) {
      return $http.get('api/properties/' + id)
    },
    getRules: function(id) {
      return $http.get('/api/parkingRules/' + id)
    },
    postProperty: function(data) {
      return $http.post('/api/property', data)
    }
    editProprty: function(id) {
      return $http.put('/api/property/' + id)
    }
  }
});