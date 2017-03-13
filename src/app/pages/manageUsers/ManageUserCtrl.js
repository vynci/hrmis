(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('ManageUserCtrl', ManageUserCtrl);

	/** @ngInject */
	function ManageUserCtrl($scope, $uibModal, $window, $rootScope, toastr, $state, userService) {
		console.log('ManageUserCtrl!');
		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
			initialize();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		function initialize(){
			userService.getAll()
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
