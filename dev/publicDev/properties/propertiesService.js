'use strict';

app.factory('propertiesService', function($http) {
  return {
    get: function() {
      return $http.get('api/properties');
    }
  };
});