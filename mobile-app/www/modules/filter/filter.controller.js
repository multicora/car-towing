(function() {
  'use strict';

  angular.module('carTowingApp')
    .controller('FilterController', FilterController);

  FilterController.$inject = ['$stateParams', '$cordovaCamera'];

  function FilterController($stateParams, $cordovaCamera) {
    var vm = this;

    vm.openCamera = function() {
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
	  correctOrientation:true
    };


    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
      alert(imageData);
    }, function(err) {
      // error
    });

  }, false);
    }
  }

})();