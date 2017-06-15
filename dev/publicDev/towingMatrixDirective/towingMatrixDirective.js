'use strict'

var app = angular.module('app');

app.directive('towingMatrix', function() {
  return {
    scope: {
      matrix: '=',
      saveMatrix: '&saveMatrix',
      confirmation: '=confirmation'
    },
    templateUrl: 'towingMatrixDirective/towingMatrixDirective.html',
  }
});

