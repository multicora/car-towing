'use strict'
var HeaderController = function(TokenService, $location, authService, $timeout) {
  var vm = this;

  vm.user = authService.getUser();

  vm.closePopup = function() {
    vm.shown = false;
    $location.path('/');
  }

  vm.logout = function() {
    authService.setUser(null);
    vm.user = null;
    TokenService.removeToken();
    vm.shown = true;

    $timeout(function () {
      vm.shown = false;
      $location.path('/');
    }, 5000);
  };
};

HeaderController.$inject = ['TokenService', '$location', 'authService', '$timeout'];

var app = angular.module('app');

app.directive('headerDirective', function() {
  return {
    scope: {
      className: '='
    },
    templateUrl: 'headerDirective/headerDirective.html',
    controller: HeaderController,
    controllerAs: 'vm'
  }
});

