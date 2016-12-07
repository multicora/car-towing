(function() {
    'use strict';

    angular.module('carTowingApp')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['config', '$http', '$state', 'TokenService'];

    function AuthService(config, $http, $state, TokenService) {
        return {
            login: login,
            logout: logout
        };

        function login(user) {
            return $http.post(config.url + "/api/login", user);
        }

        function logout() {
            TokenService.removeToken();
            $state.go('login');
        }
    }

})();