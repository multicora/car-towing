'use strict'

var app = angular.module('app');

app.directive('headerDirective', ['TokenService', function(TokenService) {
  return {
    templateUrl: 'headerDirective/headerDirective.html',
    logout: function() {
      TokenService.removeToken();
      $location.path('/');
    }
  }
}])