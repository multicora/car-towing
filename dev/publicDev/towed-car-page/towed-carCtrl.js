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

    function openMap(id, address) {
      element = document.getElementById(id);
      if (navigator.platform.indexOf('iPhone') != -1 ||
          navigator.platform.indexOf('Android')) {
        element.addEventListener('click', function() {
          window.open('https://www.waze.com/ru/livemap?zoom=4&=undefined&pin=1&' + adress);
        });
      }
    }

    customPageService.getGotTowed()
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
        vm.mapSrc = "https://embed.waze.com/iframe?zoom=16&" + vm.data.customJson.address +"&pin=1";
        openMap(map, vm.data.customJson.address);
      });
  };
})();