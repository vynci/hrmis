(function () {
	'use strict';

	angular.module('BlurAdmin.pages.reports', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('reports', {
			url: '/reports',
			templateUrl: 'app/pages/reports/reports.html',
			controller: 'ReportsCrtrl',
			title: 'Reports',
			sidebarMeta: {
				icon: 'ion-android-print',
				order: 802,
			},
		});
	}

})();
