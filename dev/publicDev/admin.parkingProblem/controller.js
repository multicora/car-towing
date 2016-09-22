'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminParkingProblemController', AdminParkingProblemController);

  AdminParkingProblemController.$inject = ['customPageService', '$http'];

  function AdminParkingProblemController(customPageService, $http) {
    var vm = this;
    var editorInstance = null;

    customPageService.get()
      .then(function(res) {
        vm.data = res.data;
        vm.data.parkingProblem = JSON.parse(res.data.parkingProblem || null);
        vm.data.parkingProblem = vm.data.parkingProblem || {};
        vm.data.parkingProblem.editableContent = JSON.parse(vm.data.parkingProblem.editableContent || null) || {ops:[]};
      });

    vm.initCallback = function(editor, name) {
      editorInstance = editor;
      editorInstance.setContents(vm.data.parkingProblem.editableContent);
    }

    vm.addParkingProblem = function() {
      vm.data.parkingProblem.editableContent = JSON.stringify(editorInstance.getContents());
      vm.data.parkingProblem.content = editorInstance.getHTML();

      customPageService.saveParkingProblem(vm.data)
        .then(function(success) {
          vm.message = 'Information successfully saved!';
        }, function(error) {
          vm.message = 'Error!';
        });
    };
  }
})();