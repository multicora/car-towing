'use strict';

app.factory('propertyService', function($http) {
  return {
    get: function(id) {
      return $http.get('api/properties/' + id);
    }
  };
});