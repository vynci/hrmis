(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('SystemSettingsCtrl', SystemSettingsCtrl);

	/** @ngInject */
	function SystemSettingsCtrl($scope, $uibModal, $window, $rootScope, toastr, fileReader, systemSettingService, personalInfoService, refDegreeCourseService, refOccupationListService, refCareerServiceService, plantillaService) {

		var userInfo = Parse.User.current();
		$scope.defaultLogo = "http://hrmis-api.herokuapp.com/parse/files/myAppId/f3a897ae507b67008f0cb593e16696a1_logo-23.png";

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			getSystemSetting();
			getDegreeCourseList();
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

		var deleteModalInstance;
		var addModalInstance;

		$scope.currentTab = 'educationalDegrees';

		function getSystemSetting(){
			systemSettingService.getById('rfeNg7kJH2')
			.then(function(results) {
				// Handle the result
				$scope.applicationInfo = {
					accountName : results[0].get('accountName'),
					accountAddress : results[0].get('accountAddress'),
					accountContactNumber : results[0].get('accountContactNumber'),
					accountLogo : results[0].get('accountLogo'),
					serviceRecordInCharge : results[0].get('serviceRecordInCharge') // VALENTINA C. PECAYO
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

		function getPlantillaList(){
			plantillaService.getAll()
			.then(function(results) {
				// Handle the result
				$scope.plantillaList = results;
			}, function(err) {
				console.log(err);
			});
		}

		function getDegreeCourseList(){
			refDegreeCourseService.getAll()
			.then(function(results) {
				// Handle the result
				$scope.degreeCourseList = results;
			}, function(err) {
				console.log(err);
			});
		}

		function getOccupationList(){
			refOccupationListService.getAll()
			.then(function(results) {
				// Handle the result
				$scope.occupationList = results;
			}, function(err) {
				console.log(err);
			});
		}

		function getCareerServiceList(){
			refCareerServiceService.getAll()
			.then(function(results) {
				// Handle the result
				$scope.careerServiceList = results;
			}, function(err) {
				console.log(err);
			});
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
			query.set("serviceRecordInCharge", $scope.applicationInfo.serviceRecordInCharge);

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
		};

		$scope.addPlantilla = function(type){
			addModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/pages/systemSettings/modals/addPlantillaModal.html',
				controller: 'AddPlantillaModalCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return type;
					}
				}
			});

			addModalInstance.result.then(function(submitVar) {
				getPlantillaList();
			});
		};

		$scope.editPlantillaItem = function(data, type){
			addModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/pages/systemSettings/modals/addPlantillaModal.html',
				controller: 'EditPlantillaModalCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return type;
					},
					currentData : function(){
						return data;
					}
				}
			});

			addModalInstance.result.then(function(submitVar) {
				getPlantillaList();
			});
		}

		$scope.addItem = function(type){
			addModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/pages/systemSettings/modals/addItemModal.html',
				controller: 'AddItemModalCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return type;
					}
				}
			});

			addModalInstance.result.then(function(submitVar) {
				if(submitVar === 'RefDegreeCourse'){
					getDegreeCourseList();
				} else if(submitVar === 'RefOccupationList'){
					getOccupationList();
				} else if(submitVar === 'RefCareerService'){
					getCareerServiceList();
				} else if(submitVar === 'Plantilla'){
					getPlantillaList();
				}
			});
		};

		$scope.editItem = function(data, type){
			addModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/pages/systemSettings/modals/addItemModal.html',
				controller: 'EditItemModalCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return type;
					},
					currentData : function(){
						return data;
					}
				}
			});

			addModalInstance.result.then(function(submitVar) {
				if(submitVar === 'RefDegreeCourse'){
					getDegreeCourseList();
				} else if(submitVar === 'RefOccupationList'){
					getOccupationList();
				} else if(submitVar === 'RefCareerService'){
					getCareerServiceList();
				} else if(submitVar === 'Plantilla'){
					getPlantillaList();
				}
			});
		}

		$scope.deletConfirmation = function (item) {
			deleteModalInstance = $uibModal.open({
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

			deleteModalInstance.result.then(function(submitVar) {
				if(submitVar === 'delete:success'){
					if($scope.currentTab === 'educationalDegrees'){
						getDegreeCourseList();
					} else if($scope.currentTab === 'occupationList'){
						getOccupationList();
					} else if($scope.currentTab === 'careerServiceList'){
						getCareerServiceList();
					} else if($scope.currentTab === 'plantillaList'){
						getPlantillaList();
					}
				}
			});
		};

		$scope.settingsTabs = {
			educationalDegrees : function(){
				$scope.currentTab = 'educationalDegrees';
			},
			occupation : function(){
				$scope.currentTab = 'occupationList';
				if(!$scope.occupationList){
					getOccupationList();
				}
			},
			careerService : function(){
				$scope.currentTab = 'careerServiceList';
				if(!$scope.careerServiceList){
					getCareerServiceList();
				}
			},
			plantilla : function(){
				$scope.currentTab = 'plantillaList';
				if(!$scope.plantillaList){
					getPlantillaList();
				}
			}
		}

	}

})();
