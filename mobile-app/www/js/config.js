(function() {
	'use strict';
	angular.module('carTowingApp')
		.constant('config', {
			url: 'http://localhost:80',
			tokenName: 'X-CART-Token'
		});

})();