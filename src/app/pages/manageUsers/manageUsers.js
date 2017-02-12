(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageUsers', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('manageUsers', {
			url: '/manage-users',
			templateUrl: 'app/pages/manageUsers/manageUsers.html',
			title: 'Manage Users',
			sidebarMeta: {
				icon: 'ion-person-stalker',
				order: 900,
			},
		});
	}

})();
