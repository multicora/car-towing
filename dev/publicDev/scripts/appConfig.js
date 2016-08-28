'use strict';

var app = angular.module('app');

function config($httpProvider, $routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/' });

  $httpProvider.defaults.headers.common['token'] = '1234';
}

config.$inject = ['$httpProvider', '$routeProvider'];

app.config(config);