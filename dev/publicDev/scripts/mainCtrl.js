(function () {
  "use strict";
  var app = angular.module('app');

  function dataService($http) {
    this.getVisitorsCount = function() {
      return $http.get('api/visitorsCounter');
    }
  }

  function ctrl($http, dataService) {
    var vm = this;
    dataService.getVisitorsCount().then(function(response){
      vm.visitorsCount = response.data;
    });
  }
  ctrl.$inject = ['$http', 'dataService'];

  app
  .controller('mainCtrl', ctrl)
  .service('dataService', dataService);
})()