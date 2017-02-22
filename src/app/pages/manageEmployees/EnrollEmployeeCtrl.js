/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageEmployees')
	.controller('EnrollEmployeeCtrl', EnrollEmployeeCtrl);

	/** @ngInject */
	function EnrollEmployeeCtrl($scope, $uibModal, $rootScope, $state, toastr) {
		console.log('enroll employee!');

		$scope.isEdit = false;
		var lastCountIndicator = 0;

		if(Parse.User.current()){
			$rootScope.isLogged = true;

		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.personalInfo = {
			birthPlace : stringToObject('Cebu City'),
			citizenship : stringToObject('Filipino'),
			gender : stringToObject('Male'),
			civilStatus : stringToObject('Single'),
			bloodType : stringToObject('A+'),
			birthDate : new Date(),
			residentialAddressInfo : {},
			permanentAddressInfo : {}
		};

		$scope.familyBackground = {
			spouseInfo : {},
			fatherInfo : {},
			motherInfo : {},
			children : []
		};

		$scope.educationInfo = {
			from : new Date(),
			to : new Date()
		};

		$scope.civilService = [];
		$scope.workExperience = [];
		$scope.voluntaryWorks = [];
		$scope.trainingPrograms = [];
		$scope.otherInfo = [];
		$scope.educationalBackground = [];
		$scope.children = [];

		$scope.showErrorMsg = function(msg) {
			toastr.error(msg, 'Error');
		};

		function showSuccessMsg(msg) {
			toastr.success(msg);
		};

		function stringToObject(stringValue){
			var objectValue = {
				label : stringValue,
				value : stringValue
			};

			return objectValue;
		}

		$scope.createEmployee = function(){
			console.log('create!');
			console.log($scope.personalInfo);
			console.log($scope.familyBackground);
			console.log($scope.educationalBackground);
			console.log($scope.civilService);
			console.log($scope.workExperience);
			console.log($scope.voluntaryWorks);
			console.log($scope.trainingPrograms);
			console.log($scope.otherInfo);
			// if($scope.personalInfo.firstName && $scope.personalInfo.lastName && $scope.personalInfo.emailAddress){
			// 	var Employee = Parse.Object.extend("Employee");
			// 	var employee = new Employee();
			//
			// 	employee.set("firstName", $scope.personalInfo.firstName);
			// 	employee.set("lastName", $scope.personalInfo.lastName);
			// 	employee.set("emailAddress", $scope.personalInfo.emailAddress);
			//
			// 	employee.save(null, {
			// 		success: function(result) {
			// 			// Execute any logic that should take place after the object is saved.
			// 			console.log(result);
			// 			createPersonalInfo(result);
			// 		},
			// 		error: function(employee, error) {
			// 			// Execute any logic that should take place if the save fails.
			// 			// error is a Parse.Error with an error code and message.
			// 		}
			// 	});
			// }else{
			// 	console.log('no save!');
			// 	$scope.showErrorMsg('Please fill-out required fields.');
			// }
		}

		function createPersonalInfo(employee){
			var PersonalInfo = Parse.Object.extend("PersonalInfo");
			var personalInfo = new PersonalInfo();

			personalInfo.set("firstName", $scope.personalInfo.firstName);
			personalInfo.set("middleName", $scope.personalInfo.middleName);
			personalInfo.set("lastName", $scope.personalInfo.lastName);
			personalInfo.set("nameExtension", $scope.personalInfo.nameExtension);
			personalInfo.set("birthDate", $scope.personalInfo.birthDate);
			personalInfo.set("birthPlace", $scope.personalInfo.birthPlace.value);
			personalInfo.set("gender", $scope.personalInfo.gender.value);
			personalInfo.set("civilStatus", $scope.personalInfo.civilStatus.value);
			personalInfo.set("citizenship", $scope.personalInfo.citizenship.value);
			personalInfo.set("height", $scope.personalInfo.height);
			personalInfo.set("weight", $scope.personalInfo.weight);
			personalInfo.set("bloodType", $scope.personalInfo.bloodType.value);
			personalInfo.set("gsisIdNumber", $scope.personalInfo.gsisIdNumber);
			personalInfo.set("pagibigNumber", $scope.personalInfo.pagibigNumber);
			personalInfo.set("sssNumber", $scope.personalInfo.sssNumber);
			personalInfo.set("philHealthNumber", $scope.personalInfo.philHealthNumber);
			personalInfo.set("residentialAddressInfo", $scope.personalInfo.residentialAddressInfo);
			personalInfo.set("permanentAddressInfo", $scope.personalInfo.permanentAddressInfo);
			personalInfo.set("emailAddress", $scope.personalInfo.emailAddress);
			personalInfo.set("mobileNumber", $scope.personalInfo.mobileNumber);
			personalInfo.set("agencyEmployeeNumber", $scope.personalInfo.agencyEmployeeNumber);
			personalInfo.set("tinNumber", $scope.personalInfo.tinNumber);
			personalInfo.set("employeeId", employee.id);

			personalInfo.save(null, {
				success: function(result) {
					// Execute any logic that should take place after the object is saved.
					createFamilyBackground(employee);
					showSuccessMsg('Personal Information Successfully Saved.');
				},
				error: function(employee, error) {
					console.log(error);
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and message.
				}
			});
		}

		function createFamilyBackground(employee){
			var FamilyBackground = Parse.Object.extend("FamilyBackground");
			var familyBackground = new FamilyBackground();
			var children = [];

			familyBackground.set("employeeId", employee.id);
			familyBackground.set("spouseInfo", $scope.familyBackground.spouseInfo);
			familyBackground.set("fatherInfo", $scope.familyBackground.fatherInfo);
			familyBackground.set("motherInfo", $scope.familyBackground.motherInfo);

			angular.forEach($scope.familyBackground.children, function(value, key) {
				delete value["$$hashKey"];
				var child = value;

				children.push(child);
			});

			familyBackground.set("childList", children);

			familyBackground.save(null, {
				success: function(result) {
					// Execute any logic that should take place after the object is saved.
					showSuccessMsg('Family Background Successfully Saved.');
					createEducationalBackground(employee);
				},
				error: function(employee, error) {
					console.log(error);
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and message.
				}
			});
		}

		function createEducationalBackground(employee){
			angular.forEach($scope.educationalBackground, function(value, key) {
				var EducationalBackground = Parse.Object.extend("EducationalBackground");
				var educationalBackground = new EducationalBackground();

				educationalBackground.set("employeeId", employee.id);
				educationalBackground.set("awards", value.awards);
				educationalBackground.set("degreeCourse", value.degreeCourse);
				educationalBackground.set("from", value.from);
				educationalBackground.set("to", value.to);
				educationalBackground.set("highestGrade", value.highestGrade);
				educationalBackground.set("levelType", value.levelType.value);
				educationalBackground.set("schoolName", value.schoolName);
				educationalBackground.set("yearGraduated", parseInt(value.yearGraduated));

				educationalBackground.save(null, {
					success: function(result) {
						// Execute any logic that should take place after the object is saved.
						showSuccessMsg('Educational Background: ' + value.levelType.value + ' Successfully Saved.');
						lastCountIndicator = lastCountIndicator + 1;
						if(lastCountIndicator === $scope.educationalBackground.length){
							$state.go('manageEmployees');
						}
					},
					error: function(employee, error) {
						console.log(error);
						// Execute any logic that should take place if the save fails.
						// error is a Parse.Error with an error code and message.
					}
				});
			});
		}

		$scope.open = function(){
			if($scope.opened){
				$scope.opened = false;
			}else{
				$scope.opened = true;
			}
		};

		$scope.opened = false;

		$scope.options = {
			showWeeks: false
		};

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

		$scope.removeChild = function(index) {
			$scope.familyBackground.children.splice(index, 1);
		};

		$scope.addChild = function() {
			console.log('add child!');
			$scope.inserted = {
				id: $scope.familyBackground.children.length+1,
				name: ''
			};
			$scope.familyBackground.children.push($scope.inserted);
		};

		$scope.removeEducation = function(index) {
			$scope.educationalBackground.splice(index, 1);
		};

		$scope.addEducation = function() {
			$scope.inserted = {};
			$scope.educationalBackground.push($scope.inserted);
		};

		$scope.removeService = function(index){
			$scope.civilService.splice(index, 1);
		}

		$scope.addService = function(){
			$scope.inserted = {};
			$scope.civilService.push($scope.inserted);
		}

		$scope.removeExperience = function(index){
			$scope.workExperience.splice(index, 1);
		}

		$scope.addExperience = function(){
			$scope.inserted = {};
			$scope.workExperience.push($scope.inserted);
		}

		$scope.removeVoluntaryWork = function(index){
			$scope.voluntaryWorks.splice(index, 1);
		}

		$scope.addVoluntaryWork = function(){
			$scope.inserted = {};
			$scope.voluntaryWorks.push($scope.inserted);
		}

		$scope.removeTrainingProgram = function(index){
			$scope.trainingPrograms.splice(index, 1);
		}

		$scope.addTrainingProgram = function(){
			$scope.inserted = {};
			$scope.trainingPrograms.push($scope.inserted);
		}

		$scope.removeOtherInfo = function(index){
			$scope.otherInfo.splice(index, 1);
		}

		$scope.addOtherInfo = function(){
			$scope.inserted = {};
			$scope.otherInfo.push($scope.inserted);
		}

	}

})();
