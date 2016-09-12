'use strict'
var HeaderController = function(TokenService, $location) {
  var vm = this;

  vm.logout = function() {
    TokenService.removeToken();
    $location.path('/');
  };
};

HeaderController.$inject = ['TokenService', '$location'];

var app = angular
  .module('app')
  .directive('headerDirective', ['TokenService', '$location', function() {
    return {
      scope: {},
      templateUrl: 'headerDirective/headerDirective.html',
      controller: HeaderController,
      controllerAs: 'vm'
    }
}]);

