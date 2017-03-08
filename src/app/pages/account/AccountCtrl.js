(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('AccountCtrl', AccountCtrl);

	/** @ngInject */
	function AccountCtrl($scope, $uibModal, $window, $rootScope, toastr) {
		console.log('acct controller!');
		if(Parse.User.current()){
			$rootScope.isLogged = true;

		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.password = {
			old : '',
			new : '',
			confirmNew : ''
		}

		$scope.updateProfile = function(){			
			updatePassword();
		}

		function showSuccessMsg(msg) {
			toastr.success(msg);
		};

		function showErrorMsg(msg) {
			toastr.error(msg, 'Error');
		};				

		function updatePassword(){
			console.log($scope.password);
			if($scope.password.old !== ''){
				console.log('update password');
				var user = Parse.User.current();

				Parse.User.logIn(user.get('username'), $scope.password.old, {
					success: function(user) {

						if($scope.password.new === $scope.password.confirmNew){

							user.set("password", $scope.password.new);
							user.save()
							.then(
								function(user) {
									console.log('Password changed', user);
									showSuccessMsg('Password Successfully Updated!');
								},
								function(error) {
									showErrorMsg('Update Password Failed');
								}
							);
						} else {
							showErrorMsg('New Password does not match!');
						}
					},
					error: function(user, error) {
						showErrorMsg('Sorry, Current Password is Invalid');
					}
				});
			}
		};


		$scope.socialProfiles = [
			{
				name: 'Facebook',
				href: 'https://www.facebook.com/vince.elizaga/',
				icon: 'socicon-facebook'
			},
			{
				name: 'Twitter',
				href: 'https://twitter.com/thevynci',
				icon: 'socicon-twitter'
			},
			{
				name: 'Google',
				icon: 'socicon-google'
			},
			{
				name: 'LinkedIn',
				icon: 'socicon-linkedin'
			},
			{
				name: 'GitHub',
				href: 'https://github.com/vynci',
				icon: 'socicon-github'
			},
			{
				name: 'StackOverflow',
				icon: 'socicon-stackoverflow'
			},
			{
				name: 'Dribbble',
				icon: 'socicon-dribble'
			},
			{
				name: 'Behance',
				icon: 'socicon-behace'
			}
	];

	$scope.unconnect = function (item) {
		item.href = undefined;
	};

	$scope.showModal = function (item) {
		$uibModal.open({
			animation: false,
			controller: 'ProfileModalCtrl',
			templateUrl: 'app/pages/profile/profileModal.html'
		}).result.then(function (link) {
			item.href = link;
		});
	};

	$scope.getFile = function () {
		fileReader.readAsDataUrl($scope.file, $scope)
		.then(function (result) {
			$scope.picture = result;
		});
	};

	$scope.switches = [true, true, false, true, true, false];
	}

})();
