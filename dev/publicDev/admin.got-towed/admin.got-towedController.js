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
      editableContent: '',
      customJson: {
        address: '',
        taxiName: '',
        taxiPhone: ''
      }
    };

    vm.editor = '';
    vm.addGotTowed = addGotTowed;

    function addGotTowed(form) {

      // console.log(data);
      console.log(vm.message);

      vm.data.editableContent = JSON.stringify(vm.editor.getContents());

      AdminGotTowedService.send(data)
        .then(function(success) {
          console.log('success');
        }, function(error) {
          console.log('error');
        });
    };
  }
})();