'use strict'

var app = angular.module('app');

app.directive('towingMatrix', function() {
  return {
    scope: {
      matrix: '=',
      saveMatrix: '&'
    },
    templateUrl: 'towingMatrixDirective/towingMatrixDirective.html',
  }
});

