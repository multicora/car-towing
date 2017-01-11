(function () {
  'use strict';

  angular.module('carTowingApp').factory('DecalService', DecalService);

  DecalService.$inject = ['config', '$http'];
  function DecalService(config, $http) {
    return {
      getBySN: getBySN
    };

    function getBySN(serialNumber) {
      return $http.get(config.url + "/api/decal-by-serial/" + serialNumber);
    }
  }
})();
