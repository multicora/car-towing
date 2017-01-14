(function () {
  'use strict';
  angular.module('carTowingApp')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = ['PhotosService'];

  function PhotosController(PhotosService) {
    var vm = this;

    vm.photos = [];

    PhotosService.getPhotos().then(function (res) {
      for (var i = res.rows.length - 1; i >= 0; i--) {
        vm.photos.push(res.rows.item(i));
      }
    });
  }

})();
