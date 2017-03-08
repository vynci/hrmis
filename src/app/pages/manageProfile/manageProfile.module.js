(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageProfile', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('manageProfile', {
			url: '/manage-profile',
			templateUrl: 'app/pages/manageEmployees/enrollEmployee/enrollEmployee.html',
			title: 'My Profile',
			controller : 'ManageProfileCtrl',
			sidebarMeta: {
				icon: 'ion-android-contact',
				order: 803,
			},
		});
	}

})();
