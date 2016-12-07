(function() {
    'use strict';
    angular
        .module('carTowingApp')
        .factory('TokenService', TokenService);

    TokenService.$inject = ['config'];

    function TokenService(config) {
        return {
            getTokenName: getTokenName,
            getToken: getToken,
            setToken: setToken,
            removeToken: removeToken,
        };

        function getToken() {
            console.log(JSON.stringify(localStorage.getItem('cart.' + getTokenName())));
            return localStorage.getItem('cart.' + getTokenName());
        }

        function setToken(token, callback) {
            localStorage.setItem('cart.' + getTokenName(), token);
            callback();
        }

        function removeToken() {
            return localStorage.removeItem('cart.' + getTokenName());
        }

        function getTokenName() {
            return config.tokenName;
        }
    }
})();