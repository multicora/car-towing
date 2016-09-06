'use strict'

var app = angular
  .module('app')
  .directive('headerDirective', function() {
    return {
      templateUrl: 'headerDirective/headerDirective.html'
    }
  });
