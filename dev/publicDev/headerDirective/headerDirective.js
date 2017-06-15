'use strict'
var HeaderController = function(TokenService, $location, authService, $timeout) {
  var vm = this;
  var timer;

  vm.user = authService.getUser();

  vm.closePopup = function() {
    vm.isShownLogoutPopup = false;
    $timeout.cancel(timer);
    $location.path('/');
  }

  function closeTimeout() {
    timer = $timeout(function () {
      vm.closePopup();
    }, 5000);
  }

  vm.login = function() {
    $location.path('/login' + $location.path());
  }

  vm.logout = function() {
    authService.setUser(null);
    vm.user = null;
    TokenService.removeToken();
    vm.isShownLogoutPopup = true;
    closeTimeout();
  };

  vm.redirect = function(url, urlParam) {
    if (urlParam) {
      return $location.path(url + '/' + urlParam);
    } else {
      return $location.path(url);
    }
  }
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

