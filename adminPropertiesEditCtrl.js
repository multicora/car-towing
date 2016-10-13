'use strict';

(function() {
  angular
    .module('app')
    .controller('adminPropertiesEditCtrl', adminPropertiesEditCtrl);

  adminPropertiesEditCtrl.$inject = ['propertiesService', '$location', '$routeParams'];

  function adminPropertiesEditCtrl(propertiesService, $location, $routeParams) {
    var vm = this;
    var userId = $routeParams.id;

    if (userId) {
      vm.editMod = true;

      vm.editProperty = function(id) {
        propertiesService.update(vm.editProperty)
          .then(function(success) {
            $location.path(/admin/properties);
          }, function(error) {
            vm.errorMes = error.data.message;
          }
        )};
    }
})();