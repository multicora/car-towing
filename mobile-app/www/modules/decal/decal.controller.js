(function () {
  'use strict';

  var app = angular.module('carTowingApp');

  app.controller('DecalController', DecalController);

  DecalController.$inject = [
    '$log',
    '$scope',
    '$stateParams',
    '$cordovaCamera',
    'DecalService',
    'PropertiesService',
    'PhotosService'
  ];
  function DecalController(
    $log,
    $scope,
    $stateParams,
    $cordovaCamera,
    DecalService,
    PropertiesService,
    PhotosService
  ) {
    var vm = this;

    vm.decal = null;
    vm.title = null;
    vm.notFoundDecalError = null;

    PropertiesService.getById($stateParams.propertyId).then(function (property) {
      vm.title = property.name || 'NO TITLE';
    });

    vm.goBack = function () {
      history.back();
    }

    vm.getDecalBySerialNumber = function (serialNumber) {
      if (serialNumber) {
        DecalService.getBySN(serialNumber).then(
          function (response) {
            if(response.status == 404) {
              vm.notFoundDecalError = response.data.message;
              vm.decal = null;
            } else {
              vm.notFoundDecalError = null;
              vm.decal = response.data;
            }
          },
          function (error) {
            vm.decal = null;
            $log(error);
          }
        );
      }
    };

    vm.openCamera = function () {
      console.log('opening camera');
      document.addEventListener("deviceready", function () {

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
          return PhotosService.addPhoto(imageData, $stateParams.propertyId, null, false);
        }).then(
          function () {
          },
          function (err) {
            console.log(' -== Error');
            console.log(JSON.stringify(err));
          }
        );

      }, false);
    }

  }

})();
