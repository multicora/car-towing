(function () {
  "use strict";
  var app = angular.module('app');

  function mainCtrlDataProvider($http) {
    this.getVisitorsCount = function() {
      return $http.get('api/visitorsCounter');
    }
  }

  function ctrl($http, mainCtrlDataProvider) {
    var vm = this;
    mainCtrlDataProvider.getVisitorsCount().then(function(response){
      vm.visitorsCount = response.data;
    });
  }
  ctrl.$inject = ['$http', 'mainCtrlDataProvider'];

  app
  .controller('mainCtrl', ctrl)
  .service('mainCtrlDataProvider', mainCtrlDataProvider);
})()