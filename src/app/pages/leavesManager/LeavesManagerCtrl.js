(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('LeavesManagerCtrl', LeavesManagerCtrl);

	/** @ngInject */
	function LeavesManagerCtrl($scope, $uibModal, $window, $rootScope, toastr, auditTrailService) {
		console.log('LeavesManagerCtrl!');
		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.requests = [
			{
				firstName : 'James',
				lastName : 'Harden',
				startDate : '2017-04-01',
				endDate : '2017-04-02',
				type : 'sick'
			},
			{
				firstName : 'Stephen',
				lastName : 'Curry',
				startDate : '2017-04-15',
				endDate : '2017-04-18',
				type : 'vacation'
			},
			{
				firstName : 'Kobe Bryant',
				lastName : 'Harden',
				startDate : '2017-04-05',
				endDate : '2017-04-06',
				type : 'sick'
			},
			{
				firstName : 'Dirk',
				lastName : 'Nowitski',
				startDate : '2017-04-22',
				endDate : '2017-04-24',
				type : 'vacation'
			},
			{
				firstName : 'James',
				lastName : 'Harden',
				startDate : '2017-04-28',
				endDate : '2017-04-30',
				type : 'vacation'
			},
		];

	}


})();
