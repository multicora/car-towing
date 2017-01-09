(function () {
  'use strict';
  angular.module('carTowingApp')
    .factory('PhotosService', PhotosService);

  PhotosService.$inject = ['DatabaseService'];

  function PhotosService(DatabaseService) {
    var allPhotos = {
      list: []
    };
    return {
      addPhoto: addPhoto,
      getPhotos: getPhotos,
      allPhotos: allPhotos
    }


    /* get all phrotos from local DB */
    function getPhotos() {
      DatabaseService.getAll(function(res) {
        console.log(res);
        alert(JSON.stringify(res));
      }, function(err) {
        console.error(err);
      });
    }

    /* get just not sent photos from local DB*/
    function getPhotosForSending() {

    }

    function addPhoto(photo) {
      alert('Photo service ' + JSON.stringify(photo));
      DatabaseService.addImage(photo, function(res) {
        alert('res ' + JSON.stringify(res));
      }, function(err) {
        alert('err ' + JSON.stringify(err));
      })
    }
  }

})();
