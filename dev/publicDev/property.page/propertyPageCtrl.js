'use strict';
function propertyCtrl(propertyService, $routeParams) {
  var vm = this;
  var propertyId = $routeParams.id;
  
  vm.property = null;
  vm.rules = null;
  propertyService.getProperty(propertyId).then(function(res) {
    vm.property = res.data;
  });
  propertyService.getRules(propertyId).then(function(res) {
    vm.rules = res.data;
  });
}
propertiesCtrl.$inject = ['propertyService'];
app.controller('propertyCtrl', propertyCtrl);