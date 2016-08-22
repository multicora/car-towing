'use strict';

var app = angular.module('app');

function config($httpProvider) {
  $httpProvider.defaults.headers.common['token'] = '1234';
}

config.$inject = ['$httpProvider'];

app.config(config);