
  var app = angular.module('app');

  app.directive('editBlocking', function() {
    return {
      templateUrl: 'managers-page/editBlockingDirective.html',
      scope: {
        blocking: '='
      }
    }
  });
