(function(NG){
  'use strict';

  var NG = angular.module('app');

  service.$inject = ['$http', 'TokenService'];
  function service ($http, TokenService) {
    return {
      getLocations: function() {
        return $http.get('api/locations?' + TokenService.getTokenName() + '=' + TokenService.getToken());
      },
      getByName: function(name) {
        return $http.get('api/locations/' + name + '?' + TokenService.getTokenName() + '=' + TokenService.getToken() );
      },
      create: function(data) {
        return $http.post('/api/locations?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
      },
      remove: function(id) {
        return $http.delete('/api/locations/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken());
      }
    };
  }

  NG.factory('locationsService', service);
})(angular);