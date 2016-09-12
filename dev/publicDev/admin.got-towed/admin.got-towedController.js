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
      editableContent: ''
    };

    vm.initCallback =initCallback;
    vm.addGotTowed = addGotTowed;

    function initCallback(editor, name) {
      editorInstance = editor;
    }

    function addGotTowed(form) {
      vm.data.editableContent = JSON.stringify(editorInstance.getContents());
      vm.data.content = editorInstance.getHTML();

      AdminGotTowedService.send(vm.data)
        .then(function(success) {
          vm.data = {};
        }, function(error) {
        });
    };
  }
})();