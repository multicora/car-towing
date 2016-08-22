'use strict';
function propertiesCtrl(propertiesService) {
  var vm = this;
  vm.properties = null;
  propertiesService.get().then(function(res) {
    vm.properties = res.data;
  });
}
propertiesCtrl.$inject = ['propertiesService'];
app.controller('propertiesCtrl', propertiesCtrl);