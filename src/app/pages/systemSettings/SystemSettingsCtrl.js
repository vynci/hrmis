(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('SystemSettingsCtrl', SystemSettingsCtrl);

	/** @ngInject */
	function SystemSettingsCtrl($scope, $uibModal, $window, $rootScope, toastr, fileReader, systemSettingService, personalInfoService) {

		var userInfo = Parse.User.current();
		$scope.defaultLogo = "http://hrmis-api.herokuapp.com/parse/files/myAppId/f3a897ae507b67008f0cb593e16696a1_logo-23.png";

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			getSystemSetting();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.applicationInfo = {
			accountName : '',
			accountAddress: '',
			accountContactNumber :'',
			accountLogo: ''
		};

		function getSystemSetting(){
			systemSettingService.getById('rfeNg7kJH2')
			.then(function(results) {
				// Handle the result
				$scope.applicationInfo = {
					accountName : results[0].get('accountName'),
					accountAddress : results[0].get('accountAddress'),
					accountContactNumber : results[0].get('accountContactNumber'),
					accountLogo : results[0].get('accountLogo')
				};
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

		$scope.openPicture = function (file) {
			var fileInput = document.getElementById('uploadFile');
			fileInput.click();
		}

		$scope.onFileSelect = function(data){
			console.log(data);
		}

		$scope.getFile = function (data) {
			personalInfoService.uploadProfilePicture(data)
			.then(function(result) {
				$scope.accountLogo = result;
				fileReader.readAsDataUrl(data, $scope)
				.then(function (result) {
					$scope.applicationInfo.accountLogo = result;
				});
			}, function(err) {
				console.log(err);
			});
		};


		$scope.updateApplicationSettings = function (employee){
			var SystemSetting = Parse.Object.extend("SystemSetting");
			var query = new SystemSetting();

			query.id = 'rfeNg7kJH2';

			if($scope.accountLogo){
				query.set("accountLogo", $scope.accountLogo._url);
			}

			query.set("accountName", $scope.applicationInfo.accountName);
			query.set("accountContactNumber", $scope.applicationInfo.accountContactNumber);
			query.set("accountAddress", $scope.applicationInfo.accountAddress);

			query.save(null, {
				success: function(result) {
					// Execute any logic that should take place after the object is saved.
					$rootScope.applyNavBarSystemSettings();
					showSuccessMsg('Application Settings Successfully Saved.');
				},
				error: function(employee, error) {
					showErrorMsg('Something went wrong, Please Try Again.');
				}
			});
		}
	}

})();
