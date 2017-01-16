(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('PropertiesController', PropertiesController);

  PropertiesController.$inject = [
    '$state',
    '$stateParams',
    '$ionicPopup',
    '$cordovaCamera',
    '$ionicPlatform',
    'LocationsService',
    'PropertiesService',
    'PhotosService'
  ];

  function PropertiesController(
    $state,
    $stateParams,
    $ionicPopup,
    $cordovaCamera,
    $ionicPlatform,
    LocationsService,
    PropertiesService,
    PhotosService
  ) {
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

    vm.emergencyTowClick = function (emergencyTowName) {
      $ionicPlatform.ready(function () {
        // TODO: DRY
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
          return PhotosService.addPhoto(imageData, emergencyTowName, $stateParams.locationId, true);
        }).then(function(res) {
          console.log('JSON.stringify(res)');
          console.log(JSON.stringify(res));
        }, function (err) {
          console.log('JSON.stringify(err)');
          console.log(JSON.stringify(err));
        });
      });
    };
  }

})();
