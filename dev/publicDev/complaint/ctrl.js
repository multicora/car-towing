'use strict';

(function(angular) {
  angular
    .module('app')
    .controller('complaintCtrl', complaintCtrl);

  complaintCtrl.$inject = ['complaintService', '$location'];

  function complaintCtrl(complaintService, $location) {
    var vm = this;

    vm.data = {
      name: '',
      email: '',
      phone: '',
      type: '',
      date: '',
      location: '',
      invoiceNumber: '',
      complaintMessage: ''
    }

    vm.closePopup = function() {
      $location.path('/');
    }

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    }

    vm.save = function(form) {
      if (form.$valid) {
        complaintService.send(vm.data)
          .then(function(res) {
            vm.closePopup();
          });
      }
    }
  }
})(angular)
