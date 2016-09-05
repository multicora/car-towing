'use strict';

(() => {
	angular
		.module('Autorisation')
    .factory("DataService", dataservice);


		dataservice.$inject = ['$http'];

		function dataservice($http) {
			return {
        login: login,
        newPassword: newPassword
    	};

    	function login(user) {
    		return $http.post("/api/login", user);
    	}

      function newPassword(password, resetToken) {
        return $http.post('api/new_password/' + resetToken, newPassword);
      }
		}
})();