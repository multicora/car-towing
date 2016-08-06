"use strict";

(function () {
  var app = angular.module('app');

  ctrl.$inject = ['$http'];
  function ctrl ($http) {
    var vm = this;

    $http.get('/api/test').then(function (res) {
      console.log(res);
    });
    $http.get('/api/asd').then(function (res) {
      console.log(res);
    });

    console.log('mainCtrl');
  }

  app.controller('mainCtrl', ctrl);
})()