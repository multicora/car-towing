'use strict';

(function() {
  angular
    .module('app')
    .controller('AdminGotTowedController', AdminGotTowedController);

  AdminGotTowedController.$inject = ['AdminGotTowedService', '$http'];

  function AdminGotTowedController(AdminGotTowedService, $http) {
    var vm = this;

    vm.data = {
      editableContent: ''
    }
    vm.addGotTowed = addGotTowed;

    function addGotTowed(form) {

      console.log(data);

      vm.data.editableContent = JSON.stringify(editor.getContents());

      AdminGotTowedService.send(data)
        .then(function(success) {
          console.log('success');
        }, function(error) {
          console.log('error');
        });
    };
  }
})();