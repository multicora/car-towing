'use strict';

app.factory('propertyService', function($http) {
  return {
    getProperty: function(id) {
      return $http.get('api/properties/' + id)
    },
    getRules: function(id) {
      return $http.get('/api/parkingRules/' + id)
    },
    create: function(data) {
      return $http.post('/api/property', data)
    },
    edit: function(id) {
      return $http.put('/api/property/' + id)
    }
  }
});