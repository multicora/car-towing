'use strict';

(function(angular) {
  angular
    .module('app')
    .controller('adminPropertiesCtrl', adminPropertiesCtrl);

  adminPropertiesCtrl.$inject = ['$filter', 'propertiesService', 'locationsService', '$location', '$scope'];

  function adminPropertiesCtrl($filter, propertiesService, locationsService, $location, $scope) {
    var vm = this;
    vm.adminProperties = [];
    vm.searchPropertyValue = '';
    vm.searchObj = {};

    locationsService.getLocations().then(function(response){
      vm.locations = response.data;
    });

    vm.getAdminProperties = function() {
      propertiesService.getProperties()
        .then(function(success) {
          vm.adminProperties = success.data;
        }, function(error) {
          console.error(error);
        });
    };

    vm.searchProperty = function() {
      vm.searchObj = {name: vm.searchPropertyValue};
    };

    vm.errorMes = '';

    function getUrl() {
      return [
        $location.protocol(),
        "://", $location.host(),
        ':', $location.port(),
        !$location.$$html5 ? '/#/' : '/'
      ].join('');
    }

    vm.addProperty = function(form) {
      if (form.$valid) {
        propertiesService.create(vm.newProperty)
        .then(function(success) {
          // TODO: replace with appropriate solution
          // vm.setPassLink = [getUrl(), success.data].join('');
          $location.path('/admin/properties');
        }, function(error) {
          // add appropriate logging
          vm.errorMes = error.data.message;
        });
      }
    }

    $scope.convertToBase64 = function(event) {
      var f = document.getElementById('file').files[0],
          r = new FileReader(),
          size = (f.size >= 1048576),
          type = (f.type.indexOf('image') >= 0);
      if (size || !type) {
        vm.fileError = 'File is too large or isn`t image, please choose another file!';
      } else {
        vm.fileError = '';
        r.onloadend = function(e) {
          // TODO: converted to base64 image
          vm.newProperty.logo = e.target.result;
          $scope.$digest();
        }
        r.readAsDataURL(f);
      }
      $scope.$apply();
    }
  }
})(angular);