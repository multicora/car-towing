'use strict';

(function() {
  angular
    .module('app')
    .controller('parkingProblemPageCtrl', parkingProblemPageCtrl);

  parkingProblemPageCtrl.$inject = ['customPageService', '$http', '$sce'];

  function parkingProblemPageCtrl(customPageService, $http, $sce) {
    var vm = this;

    customPageService.getParkingProblem()
      .then(function(res) {
        vm.data = res.data;
        var content = document.getElementById('content-parking-problem');
        content.innerHTML = vm.data.content;
      });
  };
})();