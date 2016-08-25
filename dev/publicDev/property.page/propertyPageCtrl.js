'use strict';
function propertyCtrl(propertiesService, $routeParams) {
  var vm = this;
  var propertyId = $routeParams.id;
  
  vm.property = null;
  vm.rules = null;
  propertiesService.getProperty(propertyId).then(function(res) {
    vm.property = res.data;
  });
  propertiesService.getRules(propertyId).then(function(res) {
    vm.rules = res.data;
  });
}
propertiesCtrl.$inject = ['propertiesService'];
app.controller('propertyCtrl', propertyCtrl);