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

    	function login(login, password) {
    		return $http.post("/api/login", {login: login, password: password});
    	}
		}
})();