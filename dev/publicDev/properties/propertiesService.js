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
    },
    updateTowingMatrix: function(id, data) {
      return $http.put('/api/towingMatrix/' + id, data, {
          headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        });
    },
    update: function(id, property) {
      return $http.put('api/property/' + id, {
          headers: {Authorization :TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    },
    activateContract: function(propertyId, term) {
      // return $http.put('api/property/' + id, {
      //     headers: {Authorization :TokenService.getTokenName() + ' ' + TokenService.getToken()}
      //   }
      // );
    },
    getTerms: function () {
      return [
        {
          text: '1 month',
          value: (function () {
            var date = new Date();
            date.setMonth(date.getMonth() + 1);
            return date.getTime() - Date.now();
          })()
        },
        {
          text: '2 month',
          value: (function () {
            var date = new Date();
            date.setMonth(date.getMonth() + 2);
            return date.getTime() - Date.now();
          })()
        },
        {
          text: '3 month',
          value: (function () {
            var date = new Date();
            date.setMonth(date.getMonth() + 3);
            return date.getTime() - Date.now();
          })()
        },
        {
          text: '6 month',
          value: (function () {
            var date = new Date();
            date.setMonth(date.getMonth() + 6);
            return date.getTime() - Date.now();
          })()
        },
        {
          text: '1 year',
          value: (function () {
            var date = new Date();
            date.setMonth(date.getMonth() + 12);
            return date.getTime() - Date.now();
          })()
        },
        {
          text: '2 year',
          value: (function () {
            var date = new Date();
            date.setMonth(date.getMonth() + 24);
            return date.getTime() - Date.now();
          })()
        }
      ];
    }
  };
}

app.factory('propertiesService', service);