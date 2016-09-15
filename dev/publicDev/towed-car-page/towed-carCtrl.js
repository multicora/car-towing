'use strict';

(function() {
  angular
    .module('app')
    .controller('towedСarCtrl', towedСarCtrl);

  towedСarCtrl.$inject = ['customPageService', '$http'];

  function towedСarCtrl(customPageService, $http) {
    var vm = this;

    customPageService.get()
      .then(function(res) {
        vm.data = res.data;
        vm.data.customJson = JSON.parse(res.data.customJson || null);
        vm.data.customJson = vm.data.customJson || {};
        vm.data.customJson.taxis = vm.data.customJson.taxis || [];
        vm.data.customJson.address = vm.data.customJson.address || '';
        vm.data.editableContent = res.data.editableContent || null;
        vm.data.editableContent = JSON.parse(vm.data.editableContent) || {ops:[]};
        var content = document.getElementById('content');
        content.innerHTML = vm.data.content;
      });
      
    function initMap() {
      var mapDiv = document.getElementById('map');
      console.log(mapDiv);
      var map = new google.maps.Map(mapDiv, {
        center: {lat: 44.540, lng: -78.546},
        zoom: 8
      });
    };
  };
})();