(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app'),
    configInjections = ['$routeProvider', 'locationsRoute', 'resolverProvider'];

  app.constant('locationsRoute', {
    path: '/locations',
    route: {
      templateUrl: 'locations/locations.html',
      controller: 'locationsCtrl as vm'
    }
  });

  function locaiotnsConfig($routeProvider, locationsRoute, resolverProvider) {
    var resolver = resolverProvider.$get();

    locationsRoute.route.resolve = {
      resolver: resolver.get
    };

    $routeProvider.when(locationsRoute.path, locationsRoute.route);
  }
  locaiotnsConfig.$inject = configInjections;
  app.config(locaiotnsConfig);

})(window, document, angular);