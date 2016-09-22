
  var app = angular.module('app');

  app.directive('editRuleDirective', function() {
    return {
      templateUrl: 'managers-page/editRuleDirective.html',
      scope: {
        ruleName: '=name'
      }
    }
  });
