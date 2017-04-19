(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('ManageUserCtrl', ManageUserCtrl);

	/** @ngInject */
	function ManageUserCtrl($scope, $uibModal, $window, $rootScope, toastr, $state, userService) {
		console.log('ManageUserCtrl!');
		$scope.users = [];

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
			initialize();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		function initialize(){
			userService.getByUserType('J7ELLa1Czi')
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(value, key) {
					userService.userType(value.get('userTypeId'))
					.then(function(results) {
							value.set('type', results[0].get('type'));
							$scope.users.push(value);
					}, function(err) {
						console.log(err);
					});
				});

			}, function(err) {
				console.log(err);
			});
		}

		$scope.addUser = function(){
			$uibModal.open({
				animation: true,
				templateUrl: 'app/pages/manageUsers/addUserModal.html',
				controller : 'AddUserModalCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return $scope.userinfo;
					}
				}
			});
		}

	}


})();
