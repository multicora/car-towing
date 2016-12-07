(function () {
  'use strict';

  angular.module('carTowingApp')
    .filter('PropertiesFilter', PropertiesFilter);

  PropertiesFilter.$inject = [];

  function PropertiesFilter() {
    return function (properties, query, locationId) {
      var propertiesList = [];

      properties.forEach(function (property) {
        // TODO: do more checking
        if (!property.deleted /*&& locationId == property.location */ && checkName(property.name, query)) {
          propertiesList.push(property);
        }


      });

      function checkName(allName, partName) {
        var status = true;
        if (partName == undefined || partName.length == 0) return status;

        for (var i = 0; i < partName.length; i++) {
          if (partName[i] != allName[i]) {
            return false;
          }
        }

        return status;
      }

      return propertiesList;
    }
  }

})();
