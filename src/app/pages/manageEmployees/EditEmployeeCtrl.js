/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageEmployees')
	.controller('EditEmployeeCtrl', EditEmployeeCtrl);

	/** @ngInject */
	function EditEmployeeCtrl($scope, $rootScope, $state, toastr, $stateParams, personalInfoService, familyBackgroundService, educationalBackgroundService) {
		console.log('edit employee!');
		console.log($stateParams);

		$scope.isEdit = true;

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			getPersonalInfo();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.genderList = [
			{label: 'Male', value: 'Male'},
			{label: 'Female', value: 'Female'},
		];

		$scope.civilStatusList = [
			{label: 'Single', value: 'Single'},
			{label: 'Married', value: 'Married'},
			{label: 'Annulled', value: 'Annulled'},
			{label: 'Widowed', value: 'Widowed'},
			{label: 'Separated', value: 'Separated'},
			{label: 'Others', value: 'Others'}
		];

		$scope.citizenshipList = [
			{label: 'Filipino', value: 'Filipino'},
			{label: 'Austrilian', value: 'Austrilian'},
			{label: 'American', value: 'American'}
		];

		$scope.bloodTypeList = [
			{label: 'A+', value: 'A+'},
			{label: 'B+', value: 'B+'},
			{label: 'AB+', value: 'AB+'}
		];

		$scope.placeList = [
			{label: 'Tacloban City', value: 'Tacloban City'},
			{label: 'Cebu City', value: 'Cebu City'},
			{label: 'Manila', value: 'Manila'}
		];

		$scope.levelTypeList = [
			{label: 'Elementary', value: 'Elementary'},
			{label: 'Secondary', value: 'Secondary'},
			{label: 'Vocational', value: 'Vocational'},
			{label: 'College', value: 'College'},
			{label: 'Graduate Studies', value: 'Graduate Studies'}
		];

		function getPersonalInfo(){
			personalInfoService.getByEmployeeId($stateParams.employeeId)
			.then(function(results) {
				// Handle the result
				console.log(results);
				var personalInfo = results[0];

				$scope.personalInfo = {
					firstName : personalInfo.get('firstName'),
					lastName : personalInfo.get('lastName'),
					middleName : personalInfo.get('middleName'),
					nameExtension : personalInfo.get('nameExtension'),
					birthDate : personalInfo.get('birthDate'),
					birthPlace : stringToObject(personalInfo.get('birthPlace')),
					gender : stringToObject(personalInfo.get('gender')),
					civilStatus : stringToObject(personalInfo.get('civilStatus')),
					citizenship : stringToObject(personalInfo.get('citizenship')),
					height : personalInfo.get('height'),
					weight : personalInfo.get('weight'),
					bloodType : stringToObject(personalInfo.get('bloodType')),
					gsisIdNumber : personalInfo.get('gsisIdNumber'),
					pagibigNumber : personalInfo.get('pagibigNumber'),
					philHealthNumber : personalInfo.get('philHealthNumber'),
					sssNumber : personalInfo.get('sssNumber'),
					residentialAddressInfo : personalInfo.get('residentialAddressInfo'),
					permanentAddressInfo : personalInfo.get('permanentAddressInfo'),
					emailAddress : personalInfo.get('emailAddress'),
					mobileNumber : personalInfo.get('mobileNumber'),
					agencyEmployeeNumber : personalInfo.get('agencyEmployeeNumber'),
					tinNumber : personalInfo.get('tinNumber')
				}

				console.log($scope.personalInfo);

			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}

		function getFamilyBackground(){
			familyBackgroundService.getByEmployeeId($stateParams.employeeId)
			.then(function(results) {
				// Handle the result
				console.log(results);
				var familyBackground = results[0];

				var children = []

				angular.forEach(familyBackground.get('childList'), function(value, key) {
					children.push({
						id : value.id,
						name : value.name,
						birthDate : new Date(value.birthDate),
					});
				});

				$scope.familyBackground = {
					spouseInfo : familyBackground.get('spouseInfo'),
					fatherInfo : familyBackground.get('fatherInfo'),
					motherInfo : familyBackground.get('motherInfo'),
					children : children
				}

				console.log($scope.familyBackground.children);
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}

		function getEducationalBackground(){

			$scope.educationalBackground = []

			educationalBackgroundService.getByEmployeeId($stateParams.employeeId)
			.then(function(results) {
				// Handle the result
				console.log(results);

				angular.forEach(results, function(value, key) {
					$scope.educationalBackground.push({
						levelType : stringToObject(value.get('levelType')),
						schoolName : value.get('schoolName'),
						degreeCourse : value.get('degreeCourse'),
						yearGraduated : value.get('yearGraduated'),
						highestGrade: value.get('highestGrade'),
						awards : value.get('awards'),
						from : value.get('from'),
						to : value.get('to')
					});
				});

				console.log($scope.educationalBackground);
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}


		function stringToObject(stringValue){
			var objectValue = {
				label : stringValue,
				value : stringValue
			};

			return objectValue;
		}

		$scope.profileTabs = {
			personalInfo : function(){
				console.log('personalInfo!');
			},
			familyBackground : function(){
				if(!$scope.familyBackground){
					getFamilyBackground();
					console.log('get familyBackground!');
				}
			},
			educationalBackground : function(){
				if(!$scope.educationalBackground){
					getEducationalBackground();
				}
			}
		}



	}

})();
