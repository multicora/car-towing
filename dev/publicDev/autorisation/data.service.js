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
    		return $http.post("http://WINDOWS-SFQ7090:3000/api/login", {login: login, password: password});
    	}
		}
})();