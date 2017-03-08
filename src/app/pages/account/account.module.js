(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('account', {
			url: '/account',
			templateUrl: 'app/pages/account/account.html',
			title: 'My Account',
			controller : 'AccountCtrl',
			sidebarMeta: {
				icon: 'ion-gear-b',
				order: 803,
			},
		});
	}

})();
