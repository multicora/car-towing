(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('LocationsService', LocationsService);

  LocationsService.$inject = ['config', '$http'];

  function LocationsService(config, $http) {
    var locations = {
      list: []
    };

    return {
      locations: locations,
      getLocations: getLocations,
      getLocationById: getLocationById
    };

    function getLocations() {
      return $http.get(config.url + "/api/locations").then(
        function (response) {
          locations.list = [].concat(response.data);
        }, function (error) {
          console.error(error);
        }
      );
    }

    function getLocationById(id) {
      return locations.list.find(function (location) {
        return location._id == id;
      });
    }
  }

})();
