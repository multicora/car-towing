'use strict';
(function (angular) {
  angular.module('app').service('photoesService', service);

  service.$inject = [
    '$http',
    'TokenService'
  ];
  function service (
    $http,
    TokenService
  ) {
    this.getPhotos = function (propId) {
      return $http.get('/api/files/' + propId, {
          headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    };
    this.getEmergencyTowing = function() {
      return $http.get('/api/emergency_towing', {
          headers: {Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()}
        }
      );
    };
  }

})(angular);