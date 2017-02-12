(function () {
	'use strict';

	angular.module('BlurAdmin.pages.leavesManager', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('leavesManager', {
			url: '/leaves-manager',
			templateUrl: 'app/pages/leavesManager/leavesManager.html',
			title: 'Manage Leaves',
			sidebarMeta: {
				icon: 'ion-calendar',
				order: 801,
			},
		});
	}

})();
