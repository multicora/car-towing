(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('PropertiesService', PropertiesService);

  PropertiesService.$inject = ['config', '$http'];

  function PropertiesService(config, $http) {
    var properties = {
      list: []
    };

    return {
      properties: properties,
      getProperties: getProperties,
      getPropertyById: getPropertyById
    };

    function getProperties(locationId) {
      var url = config.url + "/api/properties-by-location/" + locationId;

      return $http.get(url).then(function (response) {
        properties.list = [].concat(response.data);
      }, function (error) {
        console.error(error);
      });
    }

    function getPropertyById(propertyId) {
      return properties.list.find(function (propery) {
        return propery._id == propertyId;
      });
    }
  }

})();
