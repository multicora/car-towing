'use strict';

(function() {
  angular
    .module('app')
    .controller('towedСarCtrl', towedСarCtrl);

  towedСarCtrl.$inject = ['customPageService', '$http', '$sce'];

  function towedСarCtrl(customPageService, $http, $sce) {
    var vm = this;

    vm.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    vm.load = function() {
      document.getElementById("map-overlay").className = "map-loaded";
    }

    customPageService.getGotTowed()
      .then(function(res) {
        vm.data = res.data;
        vm.data.customJson = JSON.parse(res.data.customJson || null);
        vm.data.customJson = vm.data.customJson || {};
        vm.data.customJson.taxis = vm.data.customJson.taxis || [];
        vm.data.customJson.address = vm.data.customJson.address || '';
        vm.data.customJson.addressArray = vm.data.customJson.address.split(',');
        vm.data.editableContent = res.data.editableContent || null;
        vm.data.editableContent = JSON.parse(vm.data.editableContent) || {ops:[]};
        var content = document.getElementById('content');
        content.innerHTML = vm.data.content;
        vm.mapSrc = 'https://embed.waze.com/iframe?zoom=16&lat=' + vm.data.customJson.addressArray[0] +
            '&lon=' + vm.data.customJson.addressArray[1] +'&pin=1';
      });
  };
})();