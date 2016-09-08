'use strict'

var app = angular.module('app');

app.directive('editorDirective', function() {
  return {
    templateUrl: 'editor/editor.html'
  }
})