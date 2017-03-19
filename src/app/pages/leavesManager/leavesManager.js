(function () {
	'use strict';

	angular.module('BlurAdmin.pages.leavesManager', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		// $stateProvider
		// .state('leavesManager', {
		// 	url: '/leaves-manager',
		// 	templateUrl: 'app/pages/leavesManager/leavesManager.html',
		// 	controller: 'LeavesManagerCtrl',
		// 	title: 'Manage Leaves',
		// 	sidebarMeta: {
		// 		icon: 'ion-calendar',
		// 		order: 801,
		// 	},
		// });
		$stateProvider
		.state('leavesManager', {
			url: '/leaves',
			template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
			abstract: true,
			controller: 'LeavesManagerCtrl',
			title: 'Manage Leaves',
			sidebarMeta: {
				icon: 'ion-grid',
				order: 300,
			},
		}).state('leavesManager.basic', {
			url: '/board',
			templateUrl: 'app/pages/leavesManager/leavesManager.html',
			title: 'Calendar Board',
			sidebarMeta: {
				order: 0,
			},
		}).state('leavesManager.smart', {
			url: '/requests',
			templateUrl: 'app/pages/leavesManager/requests.html',
			title: 'Requests',
			sidebarMeta: {
				order: 100,
			},
		});
		$urlRouterProvider.when('/leaves','/leaves/board');
	}

})();
