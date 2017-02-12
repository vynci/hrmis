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
			sidebarMeta: {
				icon: 'ion-android-contact',
				order: 803,
			},
		});
	}

})();
