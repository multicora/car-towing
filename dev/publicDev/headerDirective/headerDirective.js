'use strict'

var app = angular.module('app');

app.directive('headerDirective', function() {
  return {
    scope: {
      className: '='
    },
    templateUrl: 'headerDirective/headerDirective.html'
  }
})