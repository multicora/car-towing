(function() {
    'use strict';

    angular.module('carTowingApp')
        .factory('httpInterceptor', httpInterceptor);

    httpInterceptor.$inject = ['$injector'];

    function httpInterceptor($injector) {
        return {
            request: request,
            responseError: responseError
        }

        function request(config) {
            //console.log('request ', config);
            var TokenService = $injector.get('TokenService');
            console.log(TokenService.getTokenName());
            config.headers.authorization = TokenService.getTokenName() + ' ' + TokenService.getToken();
            return config;
        }

        function responseError(response) {
            console.log('responseError ', response);
            if (response.status === 401) {
                var $state = $injector.get("$state");
                $state.go('login');
            }
        }
    }
})();