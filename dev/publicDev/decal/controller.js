'use strict';

(function(angular) {
  angular
    .module('app')
    .controller('decalController', decalController);

  decalController.$inject = ['decalService', '$http', '$location', '$routeParams'];

  function decalController(decalService, $http, $location, $routeParams) {
    var vm = this;
    var decalId = $routeParams.id;

    vm.addDecal = function(form) {
      decalService.add(vm.decal)
        .then(function(success) {
          $location.path('/managers-page');
        }, function(error) {
          console.log(error);
        });
    }

    vm.editDecal = function(id, data) {
      decalService.editDecal(id, data)
      .then(function(success) {
        $location.path('/managers-page');
      }, function(error) {
        console.log(error);
      });
    }

    if (decalId) {
      vm.decalEditEditmod = true;
      decalService.getDecalById(decalId)
        .then(function(res) {
          vm.decal = res.data;
        }, function(error) {
          console.log(error);
        });
    }
  }
})(angular);