'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminGotTowedController', AdminGotTowedController);

  AdminGotTowedController.$inject = ['AdminGotTowedService', '$http'];

  function AdminGotTowedController(AdminGotTowedService, $http) {
    var vm = this;
    var editorInstance = null;

    vm.data = {
      content: '',
      editableContent: '',
      customJson: {
        address: '',
        taxis: []
      }
    };

    vm.addTaxi = function() {
      vm.data.customJson.taxis.push({});
    }

    vm.removeTaxi = function(index) {
      vm.data.customJson.taxis.splice(index, 1);
    }

    vm.initCallback = function(editor, name) {
      editorInstance = editor;
    }

    vm.addGotTowed = function(form) {
      vm.data.editableContent = JSON.stringify(editorInstance.getContents());
      vm.data.content = editorInstance.getHTML();

      AdminGotTowedService.save(vm.data)
        .then(function(success) {
          AdminGotTowedService.get()
          .then(function(res) {
            vm.data = res.data;
            vm.data.customJson = JSON.parse(res.data.customJson);
            vm.data.editableContent = JSON.parse(res.data.editableContent) || {ops:[]};
          })
        }, function(error) {
          console.log('error');
        });
    };
  }
})();