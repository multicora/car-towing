(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('DecalController', DecalController);

  DecalController.$inject = ['$stateParams', 'DecalService', 'PropertiesService', '$cordovaCamera', 'PhotosService'];

  function DecalController($stateParams, DecalService, PropertiesService, $cordovaCamera, PhotosService) {
    var vm = this;
    vm.decalId = '';
    vm.decal = undefined;
    vm.property = PropertiesService.getPropertyById($stateParams.propertyId);
    vm.title = vm.property.name || 'NO TITLE';
    vm.notFoundDecalError = '';

    vm.getDecalBySerialNumber = function () {
      DecalService.getDecalBySerialNumber(vm.serialNumber)
        .then(function (response) {
          if(response.status == 404) {
            vm.notFoundDecalError = response.data.message;
            vm.decal = undefined;
          } else {
            vm.notFoundDecalError = '';
            vm.decal = response.data;
            console.log(response);
          }
        }, function (error) {
          vm.decal = undefined;
          console.error(error);
        });
    };

    vm.openCamera = function () {
      console.log('opening camera');
      document.addEventListener("deviceready", function () {

        var options = {
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };


        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
            var d = new Date,
              dformat = [ (d.getMonth()+1).padLeft(),
                  d.getDate().padLeft(),
                  d.getFullYear()].join('/')+
                ' ' +
                [ d.getHours().padLeft(),
                  d.getMinutes().padLeft()].join(':');



            var data = "data:image/jpeg;base64," + imageData;

            var photoObj = {
              name: "No name",
              base64: data,
              date: dformat,
              sent: false,
              deleted: false
            };

            PhotosService.addPhoto(photoObj);
          }, function (err) {
            alert(err);
          });

      }, false);
    }

  }

})();
