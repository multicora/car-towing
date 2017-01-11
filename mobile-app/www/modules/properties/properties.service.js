(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('PropertiesService', PropertiesService);

  PropertiesService.$inject = ['$q', '$log', 'config', '$http'];

  function PropertiesService($q, $log, config, $http) {
    var properties = {};

    return {
      getProperties: getProperties,
      getById: getById
    };

    function getProperties(locationId) {
      var url = config.url + "/api/properties-by-location/" + locationId;

      if (properties[locationId]) {
        return $q.resolve(properties[locationId]);
      } else {
        return $http.get(url).then(function (response) {
          properties[locationId] = response.data;
          return response.data;
        }, function (error) {
          $log(error);
        });
      }
    }

    function getById(id) {
      return $http.get('/api/property/' + id).then(function (res) {
        return res.data;
      });
    }
  }

})();
