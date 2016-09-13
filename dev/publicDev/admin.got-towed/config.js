'use strict';

var app = angular.module('app');

app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when(
    '/admin/got_towed',
    {
      templateUrl: 'admin.got-towed/admin.got-towed.html',
      controller: 'AdminGotTowedController as vm'
    }
  );
}]);