(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('PropertiesService', PropertiesService);

  PropertiesService.$inject = ['$q', '$log', 'config', '$http'];

  function PropertiesService($q, $log, config, $http) {
    var properties = null;

    return {
      getProperties: getProperties,
      getPropertyById: getPropertyById
    };

    function getProperties(locationId) {
      var url = config.url + "/api/properties-by-location/" + locationId;

      if (properties) {
        return $q.resolve(properties);
      } else {
        return $http.get(url).then(function (response) {
          properties = response.data;
          return properties;
        }, function (error) {
          $log(error);
        });
      }
    }

    function getPropertyById(propertyId) {
      return properties.list.find(function (propery) {
        return propery._id == propertyId;
      });
    }
  }

})();
