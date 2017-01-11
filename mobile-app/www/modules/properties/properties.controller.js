(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('PropertiesController', PropertiesController);

  PropertiesController.$inject = ['$state', '$stateParams', '$ionicPopup', 'LocationsService', 'PropertiesService', '$scope'];

  function PropertiesController($state, $stateParams, $ionicPopup, LocationsService, PropertiesService, $scope) {
    var vm = this;

    vm.title = null;
    vm.properties = null;

    LocationsService.getLocationById($stateParams.locationId).then(function (location) {
      vm.title = location ? location.name : "No title";
    });

    PropertiesService.getProperties($stateParams.locationId).then(function (properties) {
      vm.properties = properties;
    });

    vm.propertyClickHandler = function (property) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Please confirm.',
        template: 'Are you in ' + property.name + '?',
        okText: 'Yes',
        okType: 'button-default',
        cancelText: 'No',
        cancelType: 'button-default',
        cssClass: 'custom-conform-popup'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $state.go('decal', {propertyId: property._id});
        }
      });
    };

    // TODO: fix it
    vm.showConfirmRules = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Rules have changed.',
        template: 'Please review them.',
        okText: 'Ok',
        okType: 'button-default',
        cancelText: 'Later',
        cancelType: 'button-default',
        cssClass: 'custom-conform-popup'
      });

      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };

    // TODO: fix it
    vm.emergencyTowClick = function (emergencyTowName) {

    };
  }

})();
