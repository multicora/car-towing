(function () {
  'use strict';
  angular
    .module('carTowingApp')
    .run(function ($ionicPlatform, $rootScope, TokenService, $state, $cordovaNetwork) {
      $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

      /* Check online or offline */
      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        alert("devise is online " + networkState);
        /* here must be checking if user connect to wifi */
        /* start send images to server */
      });

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        alert("devise is offline " + networkState);
      });

      /* if not auth user */
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // if (!TokenService.getToken()) {
        //     event.preventDefault();
        //     $state.go('login');
        // }
      });
    });
})();
