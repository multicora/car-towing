(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('DecalController', DecalController);

  DecalController.$inject = ['$stateParams', 'DecalService', 'PropertiesService'];

  function DecalController($stateParams, DecalService, PropertiesService) {
    var vm = this;
    vm.decalId = '';
    vm.property = PropertiesService.getPropertyById($stateParams.propertyId);
    console.log(vm.property);
    vm.title = vm.property.name || 'NO TITLE';

    vm.getDecalById = function () {
      console.log('ckick');
      DecalService.getDecalById(vm.decalId)
        .then(function (response) {
          console.log(response);
        }, function (error) {
          console.log(error);
        });
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


        $cordovaCamera.getPicture(options).then(function (imageData) {
          alert(imageData);
        }, function (err) {
          alert(error);
        });

      }, false);
    }

  }

})();
