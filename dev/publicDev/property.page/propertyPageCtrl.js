'use strict';

(function (angular) {
  var app = angular.module('app');

  app.controller('propertyCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    'propertiesService',
    'rulesDataService'
  ];
  function ctrl(
    $routeParams,
    propertiesService,
    rulesDataService
  ) {
    var vm = this;
    var propertyId = $routeParams.id;
    
    vm.property = null;
    vm.rules = null;
    propertiesService.getProperty(propertyId).then(function(res) {
      vm.property = res.data;
    });
    rulesDataService.get(propertyId).then(function(res) {
      vm.rules = res.data;
    });
  }
})(angular);