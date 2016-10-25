'use strict';

(function(angular) {
  angular.module('app').factory('decalService', decalService);

  decalService.$inject = ['$http', 'TokenService'];

  function decalService($http, TokenService) {
    return {
      add: add,
      getDecals: getDecals,
      getDecalById: getDecalById,
      editDecal: editDecal,
      removeDecal: removeDecal
    }

    function add(data) {
      return $http.post('api/decal?' + TokenService.getTokenName() + '=' + TokenService.getToken(), data);
    }

    function getDecals() {
      return $http.get('api/decal');
    }

    function getDecalById(id) {
      return $http.get('/api/decal/' + id);
    }

    function editDecal(id, decal) {
      return $http.put('/api/decal/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken(), decal);
    }

    function removeDecal(id) {
      return $http.delete('/api/decal/' + id + '?' + TokenService.getTokenName() + '=' + TokenService.getToken());
    }
  }
})(angular);