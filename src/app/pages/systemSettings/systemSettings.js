(function () {
	'use strict';

	angular.module('BlurAdmin.pages.systemSettings', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('systemSettings', {
			url: '/system-settings',
			templateUrl: 'app/pages/systemSettings/systemSettings.html',
			title: 'System Settings',
			controller : 'SystemSettingsCtrl',
			sidebarMeta: {
				icon: 'ion-android-settings',
				order: 902,
			},
		});
	}

})();
