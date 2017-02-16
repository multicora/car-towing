(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app'),
    configInjections = ['$routeProvider', 'managersRoute', 'resolverProvider', 'userActions'];

  app.constant('managersRoute', {
    path: '/managers-page',
    route: {
      templateUrl: 'managers-page/managers.html',
      controller: 'managersCtrl as vm'
    }
  });

  function managersConfig($routeProvider, managersRoute, resolverProvider, userActions) {
    var resolver = resolverProvider.$get();

    managersRoute.route.resolve = {
      resolver: resolver.get(userActions.SEE_MANAGER_PAGE, /^\/managers-page/)
    };

    $routeProvider.when(managersRoute.path, managersRoute.route);
  }
  managersConfig.$inject = configInjections;
  app.config(managersConfig);

})(window, document, angular);