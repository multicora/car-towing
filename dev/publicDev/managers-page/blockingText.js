
  var app = angular.module('app');

  app.directive('blockingText', function() {
    return {
      templateUrl: 'managers-page/blockingTextDirective.html',
      scope: {
        blocking: '='
      }
    }
  });
