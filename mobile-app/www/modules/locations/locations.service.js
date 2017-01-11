(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('LocationsService', LocationsService);

  LocationsService.$inject = ['$q', '$log', 'config', '$http'];

  function LocationsService($q, $log, config, $http) {
    var locations = null;

    return {
      getLocations: getLocations,
      getLocationById: getLocationById
    };

    function getLocations() {
      var deferred = $q.defer();

      if (locations) {
        return $q.resolve(locations);
      } else {
        return $http.get(config.url + "/api/locations").then(
          function (response) {
            locations = response.data;
            return locations;
          }, function (error) {
            $log(error);
          }
        );
      }
    }

    function getLocationById(id) {
      return getLocations().then(function (locations) {
        return locations.find(function (location) {
          return location._id === id;
        });
      });
    }
  }

})();
