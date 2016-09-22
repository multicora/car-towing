'use strict'
var HeaderController = function(TokenService, $location, authService) {
  var vm = this;

  vm.user = authService.getUser();

  vm.logout = function() {
    authService.setUser(null);
    vm.user = null;
    TokenService.removeToken();
    $location.path('/');
  };
};

HeaderController.$inject = ['TokenService', '$location', 'authService'];

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

