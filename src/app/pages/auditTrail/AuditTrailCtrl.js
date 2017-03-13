(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('AuditTrailCtrl', AuditTrailCtrl);

	/** @ngInject */
	function AuditTrailCtrl($scope, $uibModal, $window, $rootScope, toastr, auditTrailService) {
		console.log('manage profile controller!');
		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
			initialize();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		function initialize(){
			auditTrailService.getAll()
			.then(function(results) {
				// Handle the result
				console.log(results);
				$scope.users = results;
			}, function(err) {
				console.log(err);
			});
		}

	}


})();
