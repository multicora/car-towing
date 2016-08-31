'use strict';
(() => {
	angular.module('app')
		.factory('adminPropertiesService', function($http) {
			return {
	    	getAdminProperties: function() {
	      	return $http.get('api/properties');
	    	}
	  	};
		});
})();
