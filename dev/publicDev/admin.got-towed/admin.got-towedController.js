'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminGotTowedController', AdminGotTowedController);

  AdminGotTowedController.$inject = ['AdminGotTowedService', '$http'];

  function AdminGotTowedController(AdminGotTowedService, $http) {
    var vm = this;

    vm.data = {
      content: '',
      editableContent: ''
    };

    vm.editor = '';
    vm.addGotTowed = addGotTowed;

    function addGotTowed(form) {

      console.log(vm.data);
      console.log(vm.editor);

      vm.data.editableContent = JSON.stringify(vm.editor.getContents());
      vm.data.content = vm.editor.getHTML();

      AdminGotTowedService.send(data)
        .then(function(success) {
          console.log('success');
        }, function(error) {
          console.log('error');
        });
    };
  }
})();