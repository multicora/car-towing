'use strict';

(function() {
  angular.module('app').factory("complaintService", complaintService);

  complaintService.$inject = ['$http'];

  function complaintService($http) {
    return {
      send: send
    }

    function send(data) {
      return $http.post('api/complaint', data);
    }
  }
})();