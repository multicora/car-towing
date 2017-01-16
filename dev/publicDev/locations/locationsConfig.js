(function(window, document, angular) {
  var app = angular.module('app'),
    configInjections = ['$routeProvider', 'locationsRoute', 'resolverProvider', 'userActions'];

  app.constant('locationsRoute', {
    path: '/locations',
    route: {
      templateUrl: 'locations/locations.html',
      controller: 'locationsCtrl as vm'
    }
  });

  function locaiotnsConfig($routeProvider, locationsRoute, resolverProvider, userActions) {
    var resolver = resolverProvider.$get();

    locationsRoute.route.resolve = {
      resolver: resolver.get(userActions.SEE_ADMIN_PAGE)
    };

    $routeProvider.when(locationsRoute.path, locationsRoute.route);
  }
  locaiotnsConfig.$inject = configInjections;
  app.config(locaiotnsConfig);

})(window, document, angular);