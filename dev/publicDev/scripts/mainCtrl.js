"use strict";

(function () {
  var app = angular.module('app');

  ctrl.$inject = ['$http'];
  function ctrl ($http) {
    var vm = this;

    console.log('mainCtrl');
  }

  app.controller('mainCtrl', ctrl);
})()