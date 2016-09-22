'use strict';

(function() {
  angular
    .module('app')
    .factory("customPageService", customPageService);


    customPageService.$inject = ['$http'];

    function customPageService($http) {
      return {
        save: save,
        get: get
      }

      function save(data) {
        return $http.post('api/gotTowed', data);
      }

      function get() {
        return $http.get('api/gotTowed');
      }
    }
})();