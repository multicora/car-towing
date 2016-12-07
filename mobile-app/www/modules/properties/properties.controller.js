(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('PropertiesController', PropertiesController);

  PropertiesController.$inject = ['$state', '$stateParams', '$ionicPopup', 'LocationsService', 'PropertiesService', '$scope'];

  function PropertiesController($state, $stateParams, $ionicPopup, LocationsService, PropertiesService, $scope) {
    var vm = this;

    vm.location = LocationsService.getLocationById($stateParams.locationId);

    vm.title = vm.location ? vm.location.name : "No title";

    vm.properties = PropertiesService.properties;
    vm.getProperties = function () {
      PropertiesService.getProperties();
    };

    vm.showConfirm = function (property) {
      $scope.property = property;
      console.log($scope.property);
      console.log($scope.property);
      var confirmPopup = $ionicPopup.confirm({
        title: 'Please confirm.',
        scope: $scope,
        template: 'Are you in {{property.name}}?',
        okText: 'Yes',
        okType: 'button-default',
        cancelText: 'No',
        cancelType: 'button-default',
        cssClass: 'custom-conform-popup'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $state.go('decal', {propertyId: $scope.property._id});
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };

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
  }

})();
