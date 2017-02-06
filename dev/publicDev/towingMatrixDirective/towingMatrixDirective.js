'use strict'

var app = angular.module('app');

app.directive('towingMatrix', function() {
  return {
    scope: {
      matrix: '=',
      saveMatrix: '&saveMatrix'
    },
    templateUrl: 'towingMatrixDirective/towingMatrixDirective.html',
  }
});

