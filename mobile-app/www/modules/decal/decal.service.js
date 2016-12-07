(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('DecalService', DecalService);

  DecalService.$inject = ['config', '$http'];

  function DecalService(config, $http) {
    return {
      getDecalById: getDecalById
    };

    function getDecalById(decalId) {
      return $http.get(config.url + "/api/decal/" + decalId);
    }
  }
})();
