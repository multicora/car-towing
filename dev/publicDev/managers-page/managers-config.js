(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app'),
    configInjections = ['$routeProvider', 'managersRoute', 'resolverProvider', 'userAction'];

  app.constant('managersRoute', {
    path: '/managers-page',
    route: {
      templateUrl: 'managers-page/managers.html',
      controller: 'managersCtrl as vm'
    }
  });

  function managersConfig($routeProvider, managersRoute, resolverProvider, userAction) {
    var resolver = resolverProvider.$get();

    managersRoute.route.resolve = {
      resolver: resolver.get(userAction.SEE_MANAGER_PAGE)
    };
    $routeProvider.when(managersRoute.path, managersRoute.route);
  }
  managersConfig.$inject = configInjections;
  app.config(managersConfig);

})(window, document, angular);