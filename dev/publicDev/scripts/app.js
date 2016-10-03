"use strict";

(function(angular) {
  var app = angular.module('app', ["ngRoute", "Authorization", "ngQuill", "ngSanitize"]);
  app.constant('userAction', {
    SEE_ADMIN_PAGE: 'see-admin-page',
    SEE_MANAGER_PAGE: 'see-manager-page'
  });
})(angular);