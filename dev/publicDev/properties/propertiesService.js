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
      return $http.post('/api/property', data, {
          headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    },
    getUsersProperty: function(userId) {
      return $http.get('/api/user-property/' + userId);
    },
    getPhotos: function(propId) {
      return $http.get('/api/files/' + propId, {
          headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    },
    getPhotoPath: function(photoPath) {
      return photoPath + '?' + TokenService.getTokenName() + '=' + TokenService.getToken();
    },
    delete: function(id) {
      return $http.delete('/api/property-delete/' + id, {
          headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    }
  };
}

app.factory('propertiesService', service);