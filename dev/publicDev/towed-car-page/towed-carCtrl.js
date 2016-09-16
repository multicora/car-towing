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
        vm.mapSrc = "https://embed.waze.com/iframe?zoom=16&" + vm.data.customJson.address +"&pin=1";
      });
  };
})();