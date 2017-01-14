(function () {
  'use strict';
  angular.module('carTowingApp')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = ['PhotosService'];

  function PhotosController(PhotosService) {
    var vm = this;

    vm.photos = null;

    PhotosService.getPhotos().then(function (res) {
      console.log(' -======= photos');
      console.log(JSON.stringify(res));
      vm.photos = res;
    });
  }

})();
