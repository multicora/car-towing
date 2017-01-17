'use strict';

(function(angular) {
  angular.module('app').config(config);

    config.$inject = [
      '$routeProvider',
      'resolverProvider',
      'userActions'
    ];

    function config(
      $routeProvider,
      resolverProvider,
      userActions
    ) {
      var resolver = resolverProvider.$get();

      $routeProvider.when('/photos/:propertyId', {
        templateUrl: 'photos/tpl.html',
        controller: 'photosCtrl',
        controllerAs: 'vm',
        resolve: {
          resolver: resolver.get(userActions.SEE_PHOTOS_PAGE)
        }
      });
    }
})(angular);