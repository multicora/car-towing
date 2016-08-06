"use strict";

(function () {
  var app = angular.module('app');

  ctrl.$inject = [];
  function ctrl () {
    var vm = this;

    console.log('mainCtrl');
  }

  app.controller('mainCtrl', ctrl);
})()