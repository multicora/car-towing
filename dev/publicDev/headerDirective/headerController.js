var app = angular
  .module('app')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['TokenService', '$location'];

  function HeaderController(TokenService, $location) {
    var vm = this;

    vm.logout = function() {
      TokenService.removeToken();
      $location.path('/');
    }
  };