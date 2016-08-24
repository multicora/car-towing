'use strict';
function propertyCtrl(propertyService) {
  var vm = this;
  vm.property = null;
  vm.rules = null;
  propertyService.get().then(function(res) {
    vm.property = res;
    vm.rules = res.rules;
  });
}
propertiesCtrl.$inject = ['propertyService'];
app.controller('propertyCtrl', propertiesCtrl);