"use strict";

(() => {
  angular
    .module('app')
    .controller('complaintCtrl', complaintCtrl);

  complaintCtrl.$inject = ['complaintService', '$location'];

  function complaintCtrl(complaintService, $location) {
    var vm = this;

    vm.save = function(form) {
      if (form.$valid) {
        complaintService.send(vm.data)
          .then(function(res) {
            console.log(res.data);
            $location.path('/');
          });
      }
    }
  }
})();
