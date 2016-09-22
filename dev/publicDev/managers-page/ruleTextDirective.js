
  var app = angular.module('app');

  app.directive('ruleTextDirective', function() {
    return {
      templateUrl: 'managers-page/ruleTextDirective.html',
      scope: {
        ruleName: '=name'
      }
    }
  });
