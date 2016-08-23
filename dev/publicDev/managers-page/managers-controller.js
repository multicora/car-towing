(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app'),
    configInjections = ['$routeProvider', 'managersRoute'];

  app.constant('managersRoute', {
    path: '/managers-page',
    route: {
      templateUrl: 'managers-page/managers.html',
      controller: 'managersCtrl as vm'
    }
  });

  function managersConfig($routeProvider, managersRoute) {
    $routeProvider.when(managersRoute.path, managersRoute.route);
  }
  managersConfig.$inject = configInjections;
  app.config(managersConfig);

})(window, document, angular);