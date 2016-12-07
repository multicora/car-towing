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

    function getProperties() {
      $http.get(config.url + "/api/properties")
        .then(function (response) {
          console.log(response)
          properties.list = [].concat(response.data);
          console.log(properties);
        }, function (error) {
          console.error(error);
        });
    }

    function getPropertyById(propertyId) {
      return properties.list.find(function (propery) {
        console.log('propery._id == propertyId' + propery._id + ' ' + propertyId)
        return propery._id == propertyId;
      });
    }
  }

})();
