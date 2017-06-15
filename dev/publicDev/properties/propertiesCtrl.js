'use strict';
(function (angular) {
  var app = angular.module('app');

  app.controller('propertiesCtrl', propertiesCtrl);

  propertiesCtrl.$inject = ['propertiesService'];
  function propertiesCtrl(propertiesService) {
    var vm = this;
    vm.properties = null;
    propertiesService.getProperties().then(function(res) {
      vm.properties = res.data;
    });
  }
})(angular);