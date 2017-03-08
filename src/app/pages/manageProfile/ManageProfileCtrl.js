(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('ManageProfileCtrl', ManageProfileCtrl);

	/** @ngInject */
	function ManageProfileCtrl($scope, $uibModal, $window, $rootScope, toastr, employeeService, personalInfoService, familyBackgroundService, educationalBackgroundService, civilServiceEligibilityService, workExperienceService, voluntaryWorkService, trainingProgramsService, otherInfoService, fileReader) {
		console.log('manage profile controller!');
		$scope.isEmployee = true;
		var employeeId = '';

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
			initialize(user.id);
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		function initialize(userId){
			employeeService.getByUserId(userId)
			.then(function(results) {
				// Handle the result
				console.log(results[0].attributes);
				employeeId = results[0].id;
				getPersonalInfo();
			}, function(err) {
				console.log(err);
				$state.go('auth');
			});
		}

		function stringToObject(stringValue){
			var objectValue = {
				label : stringValue,
				value : stringValue
			};

			return objectValue;
		}

		function getPersonalInfo(){
			personalInfoService.getByEmployeeId(employeeId)
			.then(function(results) {
				// Handle the result
				var personalInfo = results[0];
				$rootScope.profilePic = personalInfo.get('avatar');

				$scope.personalInfo = {
					id : personalInfo.id,
					avatar: personalInfo.get('avatar'),
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
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}

		function getFamilyBackground(){
			familyBackgroundService.getByEmployeeId(employeeId)
			.then(function(results) {
				// Handle the result
				var familyBackground = results[0];

				var children = []

				angular.forEach(familyBackground.get('childList'), function(value, key) {
					children.push({
						name : value.name,
						birthDate : new Date(value.birthDate),
					});
				});

				$scope.familyBackground = {
					id : familyBackground.id,
					spouseInfo : familyBackground.get('spouseInfo'),
					fatherInfo : familyBackground.get('fatherInfo'),
					motherInfo : familyBackground.get('motherInfo'),
					children : children
				}
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getEducationalBackground(){
			$scope.isLoading = true;
			$scope.educationalBackground = []

			educationalBackgroundService.getByEmployeeId(employeeId)
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(value, key) {
					$scope.educationalBackground.push({
						id : value.id,
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
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getCivilService(){
			$scope.isLoading = true;
			$scope.civilService = []

			civilServiceEligibilityService.getByEmployeeId(employeeId)
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(value, key) {
					$scope.civilService.push({
						id : value.id,
						careerService : value.get('careerService'),
						rating : value.get('rating'),
						examDate : value.get('examDate'),
						examPlace : value.get('examPlace'),
						licenseNumber: value.get('licenseNumber'),
						licenseReleaseDate : value.get('licenseReleaseDate')
					});
				});
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getWorkExperience(){
			$scope.isLoading = true;
			$scope.workExperience = []

			workExperienceService.getByEmployeeId(employeeId)
			.then(function(results) {
				angular.forEach(results, function(value, key) {
					$scope.workExperience.push({
						id : value.id,
						positionTitle : value.get('positionTitle'),
						department : value.get('department'),
						monthlySalary : value.get('monthlySalary'),
						salaryGrade : value.get('salaryGrade'),
						statusOfAppointment: value.get('statusOfAppointment'),
						inclusiveFromDate : value.get('inclusiveFromDate'),
						inclusiveToDate : value.get('inclusiveToDate')
					});
				});
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getVoluntaryWork(){
			$scope.isLoading = true;
			$scope.voluntaryWorks = [];

			voluntaryWorkService.getByEmployeeId(employeeId)
			.then(function(results) {
				angular.forEach(results, function(value, key) {
					$scope.voluntaryWorks.push({
						id : value.id,
						name : value.get('name'),
						numberOfHours : value.get('numberOfHours'),
						position : value.get('position'),
						inclusiveFromDate : value.get('inclusiveFromDate'),
						inclusiveToDate : value.get('inclusiveToDate')
					});
				});
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getTrainingPrograms(){
			$scope.isLoading = true;
			$scope.trainingPrograms = [];

			trainingProgramsService.getByEmployeeId(employeeId)
			.then(function(results) {
				angular.forEach(results, function(value, key) {
					$scope.trainingPrograms.push({
						id : value.id,
						name : value.get('name'),
						numberOfHours : value.get('numberOfHours'),
						conductor : value.get('conductor'),
						inclusiveFromDate : value.get('inclusiveFromDate'),
						inclusiveToDate : value.get('inclusiveToDate')
					});
				});
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getOtherInfo(){
			$scope.isLoading = true;
			$scope.otherInfo = [];

			otherInfoService.getByEmployeeId(employeeId)
			.then(function(results) {
				angular.forEach(results, function(value, key) {
					$scope.otherInfo.push({
						id : value.id,
						specialSkill : value.get('specialSkill'),
						nonAcademicRecognition : value.get('nonAcademicRecognition'),
						organizationMembership : value.get('organizationMembership')
					});
				});
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		$scope.profileTabs = {
			personalInfo : function(){
				console.log('personalInfo!');
			},
			familyBackground : function(){
				if(!$scope.familyBackground){
					getFamilyBackground();
				}
			},
			educationalBackground : function(){
				if(!$scope.educationalBackground){
					getEducationalBackground();
				}
			},
			civilService : function(){
				if(!$scope.civilService){
					getCivilService();
				}
			},
			workExperience : function(){
				if(!$scope.workExperience){
					getWorkExperience();
				}
			},
			voluntaryWork : function(){
				if(!$scope.voluntaryWorks){
					getVoluntaryWork();
				}
			},
			trainingPrograms : function(){
				if(!$scope.trainingPrograms){
					getTrainingPrograms();
				}
			},
			otherInfo : function(){
				if(!$scope.otherInfo){
					getOtherInfo();
				}
			}
		}
	}


})();
