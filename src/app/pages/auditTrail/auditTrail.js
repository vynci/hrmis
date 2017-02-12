(function () {
	'use strict';

	angular.module('BlurAdmin.pages.auditTrail', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('auditTrail', {
			url: '/audit-trail',
			templateUrl: 'app/pages/auditTrail/auditTrail.html',
			title: 'Audit Trail',
			sidebarMeta: {
				icon: 'ion-android-clipboard',
				order: 901,
			},
		});
	}

})();
