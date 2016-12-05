(function() {
  'use strict';

  angular.module('carTowingApp')
    .controller('PropertiesController', PropertiesController);

  PropertiesController.$inject = ['$stateParams'];

  function PropertiesController($stateParams) {
    var vm = this;
    
    vm.title = $stateParams.title;
  }

})();
