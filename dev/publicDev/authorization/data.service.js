'use strict';

(() => {
	angular
		.module('Autorisation')
    .factory("DataService", dataservice);


		dataservice.$inject = ['$http'];

		function dataservice($http) {
			return {
        login: login
    	};

    	function login(user) {
    		return $http.post("/api/login", user);
    	}
		}
})();