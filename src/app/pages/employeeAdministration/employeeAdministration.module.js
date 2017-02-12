(function () {
	'use strict';

	angular.module('BlurAdmin.pages.employeeAdministration', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('employeeAdministration', {
			url: '/employee-admin',
			templateUrl: 'app/pages/employeeAdministration/employeeAdministration.html',
			title: 'Manage Employees',
			sidebarMeta: {
				icon: 'ion-ios-people',
				order: 800,
			},
		});
	}

})();
