'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminGotTowedController', AdminGotTowedController);

  AdminGotTowedController.$inject = ['customPageService', '$http'];

  function AdminGotTowedController(customPageService, $http) {
    var vm = this;
    var editorInstance = null;

    // customPageService.getGotTowed()
    //   .then(function(res) {
    //     vm.data = res.data;
    //     vm.data.customJson = JSON.parse(res.data.customJson || null);
    //     vm.data.customJson = vm.data.customJson || {};
    //     vm.data.customJson.taxis = vm.data.customJson.taxis || [];
    //     vm.data.customJson.address = vm.data.customJson.address || '';
    //     vm.data.editableContent = res.data.editableContent || null;
    //     vm.data.editableContent = JSON.parse(vm.data.editableContent) || {ops:[]};
    //   });

    vm.addTaxi = function() {
      vm.data.customJson.taxis.push({});
    }

    vm.removeTaxi = function(index) {
      vm.data.customJson.taxis.splice(index, 1);
    }

    vm.initCallback = function(editor, name) {
      customPageService.getGotTowed()
      .then(function(res) {
        vm.data = res.data;
        vm.data.customJson = JSON.parse(res.data.customJson || null);
        vm.data.customJson = vm.data.customJson || {};
        vm.data.customJson.taxis = vm.data.customJson.taxis || [];
        vm.data.customJson.address = vm.data.customJson.address || '';
        vm.data.editableContent = res.data.editableContent || null;
        vm.data.editableContent = JSON.parse(vm.data.editableContent) || {ops:[]};
        editorInstance = editor;
        editorInstance.setContents(vm.data.editableContent);
      })
    }

    vm.addGotTowed = function(form) {
      vm.data.editableContent = JSON.stringify(editorInstance.getContents());
      vm.data.content = editorInstance.getHTML();

      customPageService.saveGotTowed(vm.data)
        .then(function(success) {
          vm.message = 'Information successfully saved!';
        }, function(error) {
          vm.message = 'Error!';
        });
    };
  }
})();