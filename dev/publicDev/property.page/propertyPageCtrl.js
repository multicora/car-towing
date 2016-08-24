'use strict';
function propertyCtrl(propertyService) {
  var vm = this;
  vm.property = null;
  vm.rules = null;
  vm.name = null;
  propertyService.getproperty().then(function(res) {
    vm.property = res.data;
    vm.logo = vm.property.logo;
    vm.name = vm.property.name;
  });
  propertyService.getRules().then(function(res) {
    vm.rules = res.data;
  });
}
propertiesCtrl.$inject = ['propertyService'];
app.controller('propertyCtrl', propertyCtrl);