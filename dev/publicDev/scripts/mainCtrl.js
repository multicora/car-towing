(function () {
  "use strict";
  var app = angular.module('app');

  function mainCtrlDataProvider($http) {
    this.getVisitorsCount = function() {
      return $http.get('api/visitorsCounter');
    }
  }

  function ctrl($http, mainCtrlDataProvider, $scope, $location) {
    var vm = this;
    mainCtrlDataProvider.getVisitorsCount().then(function(response){
      vm.visitorsCount = response.data;
    });

    $scope.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    }
  }
  ctrl.$inject = ['$http', 'mainCtrlDataProvider', '$scope', '$location'];

  app
  .controller('mainCtrl', ctrl)
  .service('mainCtrlDataProvider', mainCtrlDataProvider);
})()