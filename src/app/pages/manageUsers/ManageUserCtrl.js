(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('ManageUserCtrl', ManageUserCtrl);

	/** @ngInject */
	function ManageUserCtrl($scope, $uibModal, $window, $rootScope, toastr, $state, userService) {
		console.log('ManageUserCtrl!');
		$scope.users = [];
		var modalInstance;

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
			initialize();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		function initialize(){
			$scope.users = [];

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

		function showSuccessMsg(msg) {
			toastr.success(msg);
		};

		function showErrorMsg(msg) {
			toastr.error(msg, 'Error');
		};

		$scope.addUser = function(){
			modalInstance = $uibModal.open({
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

			modalInstance.result.then(function(submitVar) {
				initialize();
			});
		}

		$scope.actionUser = function(item, action){
			item.set('isActive', action);

			item.save(null, {useMasterKey:true}, {
				success: function(user) {
					showSuccessMsg('User Successfully Activated.');
					initialize();
				},
				error: function(user, error) {
					showErrorMsg('Something went wrong, Please Try Again.');
				}
			});
		}

		$scope.deletConfirmation = function (item) {
			modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/pages/systemSettings/modals/deleteConfirmation.html',
				controller: 'DeleteItemModalCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return item;
					}
				}
			});

			modalInstance.result.then(function(submitVar) {
				initialize();
			});
		};

	}


})();
