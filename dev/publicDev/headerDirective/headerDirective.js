'use strict'

var app = angular
  .module('app')
  .controller('HeaderController', HeaderController)
  .directive('headerDirective', function() {
    return {
      templateUrl: 'headerDirective/headerDirective.html'
    }
  });

  HeaderController.$inject = ['TokenService', '$location'];

  function HeaderController(TokenService, $location) {
    var vm = this;

    vm.logout = function() {
      TokenService.removeToken();
      $location.path('/');
    }
  }
