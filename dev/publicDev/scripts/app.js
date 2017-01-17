'use strict';

(function(angular) {
  var app = angular.module('app', ['ngRoute', 'Authorization', 'ngQuill', 'ngSanitize', 'angularSpinner']);
  app.constant('userActions', {
    SEE_ADMIN_PAGE: 'see-admin-page',
    SEE_MANAGER_PAGE: 'see-manager-page',
    SEE_PHOTOS_PAGE: 'see-photos-page'
  });
})(angular);