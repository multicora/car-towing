(function() {
    'use strict';

    angular.module('carTowingApp')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', 'TokenServiceProvider'];

    function config($stateProvider, $urlRouterProvider, $httpProvider, TokenServiceProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        var TokenService = TokenServiceProvider.$get();
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
        $httpProvider.defaults.headers.common['X-CART-Token'] = TokenService.getToken() || '';


        /* Routing */
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/auth/login.tmpl.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('locations', {
                url: '/locations',
                templateUrl: 'modules/locations/locations.tmpl.html',
                controller: 'LocationsController',
                controllerAs: 'vm',
                cache: false
            })
            .state('properties', {
                url: '/properties/:locationId',
                templateUrl: 'modules/properties/properties.tmpl.html',
                controller: 'PropertiesController',
                controllerAs: 'vm',
                cache: false
            })
            .state('decal', {
                url: '/decal/:propertyId',
                templateUrl: 'modules/decal/decal.tmpl.html',
                controller: 'DecalController',
                controllerAs: 'vm'
            })
            .state('photos', {
                url: '/photos',
                templateUrl: 'modules/photos/photos.tmpl.html',
                controller: 'PhotosController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/locations');
    }
})();