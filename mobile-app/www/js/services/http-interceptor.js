(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('httpInterceptor', httpInterceptor);

  httpInterceptor.$inject = [
    '$injector',
    '$q'
  ];

  function httpInterceptor(
    $injector,
    $q
  ) {
    return {
      request: request,
      responseError: responseError
    };

    function request(config) {
      var TokenService = $injector.get('TokenService');
      config.headers.authorization = TokenService.getTokenName() + ' ' + TokenService.getToken();
      return config;
    }

    function responseError(response) {
      if (response.status === 401) {
        var $state = $injector.get("$state");
        $state.go('login');
      }
      return $q.reject(response);
    }
  }
})();
