(function () {
  'use strict';
  angular.module('carTowingApp')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = ['PhotosService'];

  function PhotosController(PhotosService) {
    var vm = this;
    vm.photos = PhotosService.allPhotos.list;

    vm.getAllPhotos = function() {
      PhotosService.getPhotos();
    }
  }

})();
