(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageEmployees', [])
	.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
		.state('manageEmployees', {
			url: '/manage-employees',
			templateUrl: 'app/pages/manageEmployees/manageEmployees.html',
			controller : 'ManageEmployeesCtrl',
			title: 'Manage Employees',
			sidebarMeta: {
				icon: 'ion-ios-people',
				order: 800,
			},
		})

		.state('editEmployee', {
			url: '/edit-employee',
			templateUrl: 'app/pages/manageEmployees/enrollEmployee/enrollEmployee.html',
			title: 'Edit Employee Profile',
			sidebarMeta: {
				order: 0,
			},
		})

		.state('enrollEmployee', {
			url: '/enroll',
			templateUrl: 'app/pages/manageEmployees/enrollEmployee/enrollEmployee.html',
			title: 'Enroll Employee',
			sidebarMeta: {
				order: 0,
			},
		});
	}

})();
