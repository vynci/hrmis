(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('AccountCtrl', AccountCtrl);

	/** @ngInject */
	function AccountCtrl($scope, $uibModal, $window, $rootScope) {

		if(Parse.User.current()){
			$rootScope.isLogged = true;

		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.picture = 'assets/img/app/profile/vince3.jpg';

		$scope.removePicture = function () {
			$scope.picture = $filter('appImage')('theme/no-photo.png');
			$scope.noPicture = true;
		};

		$scope.uploadPicture = function () {
			var fileInput = document.getElementById('uploadFile');
			fileInput.click();

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
