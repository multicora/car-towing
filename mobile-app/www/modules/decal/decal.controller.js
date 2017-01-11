(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('DecalController', DecalController);

  DecalController.$inject = ['$stateParams', 'DecalService', 'PropertiesService', '$cordovaCamera'];

  function DecalController($stateParams, DecalService, PropertiesService, $cordovaCamera) {
    var vm = this;
    vm.decalId = '';
    vm.decal = undefined;
    vm.property = PropertiesService.getPropertyById($stateParams.propertyId);
    vm.title = vm.property.name || 'NO TITLE';
    vm.notFoundDecalError = '';

    vm.getDecalBySerialNumber = function () {
      if (vm.serialNumber) {
        DecalService.getDecalBySerialNumber(vm.serialNumber).then(
          function (response) {
            if(response.status == 404) {
              vm.notFoundDecalError = response.data.message;
              vm.decal = undefined;
            } else {
              vm.notFoundDecalError = '';
              vm.decal = response.data;
              console.log(response);
            }
          },
          function (error) {
            vm.decal = undefined;
            console.error(error);
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
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };


        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
          alert(imageData);
        }, function (err) {
          alert(error);
        });

      }, false);
    }

  }

})();
