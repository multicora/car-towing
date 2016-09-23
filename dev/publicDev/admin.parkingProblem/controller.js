'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminParkingProblemController', AdminParkingProblemController);

  AdminParkingProblemController.$inject = ['customPageService', '$http'];

  function AdminParkingProblemController(customPageService, $http) {
    var vm = this;
    var editorInstance = null;

    customPageService.getParkingProblem()
      .then(function(res) {
        vm.data = res.data || {};
        vm.data.editableContent = JSON.parse(res.data.editableContent || null) || {ops:[]};
      });

    vm.initCallback = function(editor, name) {
      editorInstance = editor;
      editorInstance.setContents(vm.data.editableContent);
    }

    vm.addParkingProblem = function() {
      vm.data.editableContent = JSON.stringify(editorInstance.getContents());
      vm.data.content = editorInstance.getHTML();

      customPageService.saveParkingProblem(vm.data)
        .then(function(success) {
          vm.message = 'Information successfully saved!';
        }, function(error) {
          vm.message = 'Error!';
        });
    };
  }
})();