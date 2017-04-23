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

		$scope.confirmList = [
			{label: 'Yes', value: 'Yes'},
			{label: 'No', value: 'No'}
		];


		$scope.bloodTypeList = [
			{label: 'O-', value: 'O-'},
			{label: 'O+', value: 'O+'},
			{label: 'A-', value: 'A-'},
			{label: 'A+', value: 'A+'},
			{label: 'B-', value: 'B-'},
			{label: 'B+', value: 'B+'},
			{label: 'AB-', value: 'AB-'},
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

		var changeList = [];

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

		function getOtherInfoB(){
			$scope.isLoading = true;
			$scope.otherInfoB = {};

			otherInfoService.infoBgetByEmployeeId(employeeId)
			.then(function(results) {
				var data = results[0];
				if(data){
					$scope.otherInfoB = {
						id : data.id,
						question1A : stringToObject(data.get('question1A')),
						question1ADetails : data.get('question1ADetails'),
						question1B : stringToObject(data.get('question1B')),
						question1BDetails : data.get('question1BDetails'),
						question2A : stringToObject(data.get('question2A')),
						question2ADetails : data.get('question2ADetails'),
						question2B : stringToObject(data.get('question2A')),
						question2BDetails : data.get('question2ADetails'),
						question3A : stringToObject(data.get('question3A')),
						question3ADetails : data.get('question3ADetails'),
						question4A : stringToObject(data.get('question4A')),
						question4ADetails : data.get('question4ADetails'),
						question5A : stringToObject(data.get('question5A')),
						question5ADetails : data.get('question5ADetails'),
						question5B : stringToObject(data.get('question4B')),
						question5BDetails : data.get('question4BDetails'),
						question6A : stringToObject(data.get('question5A')),
						question6ADetails : data.get('question5ADetails'),
						question7A : stringToObject(data.get('question7A')),
						question7ADetails : data.get('question7ADetails'),
						question7B : stringToObject(data.get('question7B')),
						question7BDetails : data.get('question7BDetails'),
						question7C : stringToObject(data.get('question7C')),
						question7CDetails : data.get('question7CDetails'),
						referenceName1 : data.get('referenceName1'),
						referenceAddress1 : data.get('referenceAddress1'),
						referenceContactNumber1 : data.get('referenceContactNumber1'),
						referenceName2 : data.get('referenceName2'),
						referenceAddress2 : data.get('referenceAddress2'),
						referenceContactNumber2 : data.get('referenceContactNumber2'),
						referenceName3 : data.get('referenceName3'),
						referenceAddress3 : data.get('referenceAddress3'),
						referenceContactNumber3 : data.get('referenceContactNumber3'),
						govIssuedIdNumber : data.get('govIssuedIdNumber'),
						govIssuedDateOfIssuance : data.get('govIssuedDateOfIssuance'),
						govIssuedId : data.get('govIssuedId')
					};
				} else{
					$scope.otherInfoB = {
						question1A : '',
						question1ADetails : '',
						question1B : '',
						question1BDetails : '',
						question2A : '',
						question2ADetails : '',
						question2B : '',
						question2BDetails : '',
						question3A : '',
						question3ADetails : '',
						question4A : '',
						question4ADetails : '',
						question5A : '',
						question5ADetails : '',
						question5B : '',
						question5BDetails : '',
						question6A : '',
						question6ADetails : '',
						question7A : '',
						question7ADetails : '',
						question7B : '',
						question7BDetails : '',
						question7C : '',
						question7CDetails : '',
						referenceName1 : '',
						referenceAddress1 : '',
						referenceContactNumber1 : '',
						referenceName2 : '',
						referenceAddress2 : '',
						referenceContactNumber2 : '',
						referenceName3 : '',
						referenceAddress3 : '',
						referenceContactNumber3 : '',
						govIssuedIdNumber : '',
						govIssuedDateOfIssuance : new Date(),
						govIssuedId : ''
					};
				}

				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			});
		}

		$scope.requestUpdate = function(){
			var unique = changeList.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			});

			var requests = [];

			angular.forEach(unique, function(data) {
				var tmp = data.split(':');
				var updatedValue = $scope[tmp[0]][tmp[1]];

				if(typeof updatedValue === 'object'){
					if(updatedValue.value){
						updatedValue = updatedValue.value;
					}
				}

				requests.push({
					key : data,
					value : updatedValue
				});
			});
			console.log(requests);
		}

		$scope.addToChangeList = function(key, value){
			if(changeList.length > 0){
				angular.forEach(changeList, function(data, keyName) {
					if(data.key !== key){
						changeList.push(key);
					}
				});
			} else{
				changeList.push(key);
			}
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
			},
			otherInfoB : function(){
				if(!$scope.otherInfoB){
					getOtherInfoB();
				}
			}
		}
	}


})();
