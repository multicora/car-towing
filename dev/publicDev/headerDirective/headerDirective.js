'use strict'

var app = angular
  .module('app')
  .directive('headerDirective', ['TokenService', '$location', function() {
    return {
      templateUrl: 'headerDirective/headerDirective.html',
      controller: HeaderController,
      controllerAs: 'vm'
    }
  }]);

var HeaderController = function(TokenService, $location) {
  var vm = this;

  vm.logout = function() {
    console.log(1111);
    TokenService.removeToken();
    $location.path('/');
    console.log('2222');
  };
};

HeaderController.$inject = ['TokenService', '$location'];
