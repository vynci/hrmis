/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageEmployees')
	.controller('EnrollEmployeeCtrl', EnrollEmployeeCtrl);

	/** @ngInject */
	function EnrollEmployeeCtrl($scope, $uibModal, $rootScope, $state, toastr, fileReader, personalInfoService, cityMunicipalityService, refOccupationListService, refCareerServiceService, refDegreeCourseService, plantillaService) {

		$scope.format = 'MM/dd/yyyy';
		$scope.isEdit = false;
		var lastCountIndicator = 0;
		var defaultAvatar = "http://hrmis-api.herokuapp.com/parse/files/myAppId/709d67e1750729d0f4f8f15837e28713_Profile-sky-ovnis.jpg";

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			getCityList('', '08');
			getOccupationList();
			getCareerServiceList();
			getDegreeCourseList();
			getPlantillaList();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.personalInfo = {
			avatar : defaultAvatar,
			birthPlace : stringToObject('Cebu City'),
			citizenship : stringToObject('Filipino'),
			gender : stringToObject('Male'),
			civilStatus : stringToObject('Single'),
			bloodType : stringToObject('A+'),
			birthDate : null,
			residentialAddressInfo : {},
			permanentAddressInfo : {}
		};

		$scope.familyBackground = {
			spouseInfo : {},
			fatherInfo : {},
			motherInfo : {},
			children : []
		};

		$scope.otherInfoB = {
			question1A : {},
			question1ADetails : '',
			question1B : {},
			question1BDetails : '',
			question2A : {},
			question2ADetails : '',
			question2B : {},
			question2BDetails : '',
			question3A : {},
			question3ADetails : '',
			question4A : {},
			question4ADetails : '',
			question5A : {},
			question5ADetails : '',
			question5B : {},
			question5BDetails : '',
			question6A : {},
			question6ADetails : '',
			question7A : {},
			question7ADetails : '',
			question7B : {},
			question7BDetails : '',
			question7C : {},
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
			govIssuedDateOfIssuance : null,
			govIssuedId : ''
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
		$scope.careerServiceList = [];
		$scope.positionTitleList = [];
		$scope.salaryIncrementList = createArrayList(8);

		function createArrayList(num){
			var x = [];

			for(var i=0; i < num; i++){
				x.push({
					label: i + 1,
					value: i + 1
				});
			}

			return x;
		}

		$scope.computeMonthlySalary = function(experience){
			if(experience.positionTitle.salaryGrade && experience.salaryIncrement){
				var tmp = $scope.workExperience;
				$scope.workExperience = [];
				angular.forEach(tmp, function(value, key) {
					if(value.id === experience.id){
						value.monthlySalary = ( value.positionTitle.salaryGrade * value.salaryIncrement.value);
					}
					$scope.workExperience.push(value);
				});
			}
		}

		$scope.showErrorMsg = function(msg) {
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
				$scope.profilePictureFile = result;
				console.log(result);
				fileReader.readAsDataUrl(data, $scope)
					.then(function (result) {
						$scope.personalInfo.avatar = result;
					});
			}, function(err) {
				console.log(err);
			});
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
			// createOtherInfoB();
			if($scope.personalInfo.firstName && $scope.personalInfo.lastName && $scope.personalInfo.emailAddress){
				var Employee = Parse.Object.extend("Employee");
				var employee = new Employee();

				employee.set("firstName", $scope.personalInfo.firstName);
				employee.set("lastName", $scope.personalInfo.lastName);
				employee.set("emailAddress", $scope.personalInfo.emailAddress);

				employee.save(null, {
					success: function(result) {
						// Execute any logic that should take place after the object is saved.
						console.log(result);
						createPersonalInfo(result);
					},
					error: function(employee, error) {
						// Execute any logic that should take place if the save fails.
						// error is a Parse.Error with an error code and message.
					}
				});
			}else{
				console.log('no save!');
				$scope.showErrorMsg('Please fill-out required fields.');
			}
		}

		$scope.searchCity = function(){
			console.log('search');
			getCityList($scope.personalInfo.birthPlace, null);
		}

		function getPlantillaList(){
			plantillaService.getAll()
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(data, key) {
					$scope.positionTitleList.push({
						label : data.get('positionTitle'),
						value : data.get('positionTitle'),
						salaryGrade : data.get('salaryGrade'),
						plantillaId : data.get('plantillaId')
					});
				});
			}, function(err) {
				console.log(err);
			});
		}

		function getCityList(cityName, provCode){
			cityMunicipalityService.getAll(cityName, provCode)
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(data, key) {
					$scope.cityList.push({
						label : data.get('citymunDesc'),
						value : data.get('citymunDesc')
					});
				});
			}, function(err) {
				console.log(err);
			});
		}

		function getDegreeCourseList(){
			refDegreeCourseService.getAll()
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(data, key) {
					$scope.degreeCourseList.push({
						label : data.get('name'),
						value : data.get('name')
					});
				});
			}, function(err) {
				console.log(err);
			});
		}

		function getOccupationList(){
			refOccupationListService.getAll()
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(data, key) {
					$scope.occupationList.push({
						label : data.get('name'),
						value : data.get('name')
					});
				});
			}, function(err) {
				console.log(err);
			});
		}

		function getCareerServiceList(){
			refCareerServiceService.getAll()
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(data, key) {
					$scope.careerServiceList.push({
						label : data.get('name'),
						value : data.get('name')
					});
				});
			}, function(err) {
				console.log(err);
			});
		}

		function createPersonalInfo(employee){
			var PersonalInfo = Parse.Object.extend("PersonalInfo");
			var personalInfo = new PersonalInfo();

			if($scope.profilePictureFile){
				personalInfo.set("avatar", $scope.profilePictureFile._url);
			}else{
				personalInfo.set("avatar", defaultAvatar);
			}

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
				}
			});
		}

		function createFamilyBackground(employee){
			var FamilyBackground = Parse.Object.extend("FamilyBackground");
			var familyBackground = new FamilyBackground();
			var children = [];

			if($scope.familyBackground.spouseInfo.occupation){
				$scope.familyBackground.spouseInfo.occupation = $scope.familyBackground.spouseInfo.occupation.value;
			}else{
				$scope.familyBackground.spouseInfo.occupation = 'None';
			}

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
				}
			});
		}

		function createEducationalBackground(employee){
			if($scope.educationalBackground.length > 0){
				angular.forEach($scope.educationalBackground, function(value, key) {
					var EducationalBackground = Parse.Object.extend("EducationalBackground");
					var educationalBackground = new EducationalBackground();

					educationalBackground.set("employeeId", employee.id);
					educationalBackground.set("awards", value.awards);
					educationalBackground.set("degreeCourse", value.degreeCourse.value);
					educationalBackground.set("from", value.from);
					educationalBackground.set("to", value.to);
					educationalBackground.set("highestGrade", value.highestGrade);
					educationalBackground.set("levelType", value.levelType.value);
					educationalBackground.set("schoolName", value.schoolName);
					educationalBackground.set("yearGraduated", parseInt(value.yearGraduated));

					educationalBackground.save(null, {
						success: function(result) {
							showSuccessMsg('Educational Background: ' + value.levelType.value + ' Successfully Saved.');
							lastCountIndicator = lastCountIndicator + 1;
							if(lastCountIndicator === $scope.educationalBackground.length){
								lastCountIndicator = 0;
								createCivilService(employee);
							}
						},
						error: function(employee, error) {
							console.log(error);
						}
					});
				});
			} else {
				createCivilService(employee);
			}
		}

		function createCivilService(employee){
			if($scope.civilService.length > 0){
				angular.forEach($scope.civilService, function(value, key) {
					var CivilServiceEligibility = Parse.Object.extend("CivilServiceEligibility");
					var civilServiceEligibility = new CivilServiceEligibility();

					civilServiceEligibility.set("employeeId", employee.id);
					civilServiceEligibility.set("careerService", value.careerService.value);
					civilServiceEligibility.set("rating", parseInt(value.rating));
					civilServiceEligibility.set("examDate", value.examDate);
					civilServiceEligibility.set("examPlace", value.examPlace.value);
					civilServiceEligibility.set("licenseNumber", value.licenseNumber);
					civilServiceEligibility.set("licenseReleaseDate", value.licenseReleaseDate);

					civilServiceEligibility.save(null, {
						success: function(result) {
							// Execute any logic that should take place after the object is saved.
							showSuccessMsg('Civil Service: ' + value.careerService + ' Successfully Saved.');
							lastCountIndicator = lastCountIndicator + 1;
							if(lastCountIndicator === $scope.civilService.length){
								lastCountIndicator = 0;
								createWorkExperience(employee);
							}
						},
						error: function(employee, error) {
							console.log(error);
						}
					});
				});
			}else{
				createWorkExperience(employee);
			}

		}

		function createWorkExperience(employee){
			if($scope.workExperience.length > 0){
				angular.forEach($scope.workExperience, function(value, key) {
					var WorkExperience = Parse.Object.extend("WorkExperience");
					var workExperience = new WorkExperience();
					var isGovernmentService = false;

					if(value.isGovernmentService.value === 'Yes'){
						isGovernmentService = true;
					}

					if(value.salaryIncrement){
						workExperience.set("salaryIncrement", value.salaryIncrement.value);
					}

					if(value.statusOfAppointment){
						workExperience.set("statusOfAppointment", value.statusOfAppointment.value);
					}

					workExperience.set("employeeId", employee.id);
					workExperience.set("positionTitle", value.positionTitle.value);
					workExperience.set("department", value.department);
					workExperience.set("monthlySalary", parseInt(value.monthlySalary));
					workExperience.set("salaryGrade", value.positionTitle.salaryGrade);
					workExperience.set("statusOfAppointment", value.statusOfAppointment.value);
					workExperience.set("isGovernmentService", isGovernmentService);
					workExperience.set("inclusiveFromDate", value.inclusiveFromDate);
					workExperience.set("inclusiveToDate", value.inclusiveToDate);

					workExperience.save(null, {
						success: function(result) {
							// Execute any logic that should take place after the object is saved.
							showSuccessMsg('Work Experience: ' + value.positionTitle + ' Successfully Saved.');
							lastCountIndicator = lastCountIndicator + 1;
							if(lastCountIndicator === $scope.workExperience.length){
								lastCountIndicator = 0;
								createVoluntaryWork(employee);
							}
						},
						error: function(employee, error) {
							console.log(error);
						}
					});
				});
			}else{
				createVoluntaryWork(employee);
			}

		}

		function createVoluntaryWork(employee){
			if($scope.voluntaryWorks.length > 0){
				angular.forEach($scope.voluntaryWorks, function(value, key) {
					var VoluntaryWork = Parse.Object.extend("VoluntaryWork");
					var voluntaryWork = new VoluntaryWork();

					voluntaryWork.set("employeeId", employee.id);
					voluntaryWork.set("name", value.name);
					voluntaryWork.set("inclusiveFromDate", value.inclusiveFromDate);
					voluntaryWork.set("inclusiveToDate", value.inclusiveToDate);
					voluntaryWork.set("numberOfHours", parseInt(value.numberOfHours));
					voluntaryWork.set("position", value.position);

					voluntaryWork.save(null, {
						success: function(result) {
							// Execute any logic that should take place after the object is saved.
							showSuccessMsg('Voluntary Work: ' + value.name + ' Successfully Saved.');
							lastCountIndicator = lastCountIndicator + 1;
							if(lastCountIndicator === $scope.voluntaryWorks.length){
								lastCountIndicator = 0;
								createTrainingProgram(employee);
							}
						},
						error: function(employee, error) {
							console.log(error);
						}
					});
				});
			}else{
				createTrainingProgram(employee);
			}

		}

		function createTrainingProgram(employee){
			if($scope.trainingPrograms.length > 0){
				angular.forEach($scope.trainingPrograms, function(value, key) {
					var TrainingPrograms = Parse.Object.extend("TrainingPrograms");
					var trainingPrograms = new TrainingPrograms();

					trainingPrograms.set("employeeId", employee.id);
					trainingPrograms.set("name", value.name);
					trainingPrograms.set("inclusiveFromDate", value.inclusiveFromDate);
					trainingPrograms.set("inclusiveToDate", value.inclusiveToDate);
					trainingPrograms.set("numberOfHours", parseInt(value.numberOfHours));
					trainingPrograms.set("conductor", value.conductor);

					trainingPrograms.save(null, {
						success: function(result) {
							showSuccessMsg('Training Program: ' + value.name + ' Successfully Saved.');
							lastCountIndicator = lastCountIndicator + 1;
							if(lastCountIndicator === $scope.trainingPrograms.length){
								lastCountIndicator = 0;
								createOtherInfo(employee);
							}
						},
						error: function(employee, error) {
							console.log(error);
						}
					});
				});
			}else{
				createOtherInfo(employee);
			}

		}

		function createOtherInfo(employee){
			if($scope.otherInfo.length > 0){
				angular.forEach($scope.otherInfo, function(value, key) {
					var OtherInfo = Parse.Object.extend("OtherInfo");
					var otherInfo = new OtherInfo();

					otherInfo.set("employeeId", employee.id);
					otherInfo.set("specialSkill", value.specialSkill);
					otherInfo.set("nonAcademicRecognition", value.nonAcademicRecognition);
					otherInfo.set("organizationMembership", value.organizationMembership);

					otherInfo.save(null, {
						success: function(result) {
							showSuccessMsg('Other Info: ' + value.name + ' Successfully Saved.');
							lastCountIndicator = lastCountIndicator + 1;
							if(lastCountIndicator === $scope.otherInfo.length){
								// $state.go('manageEmployees');
								lastCountIndicator = 0;
							}
						},
						error: function(employee, error) {
							console.log(error);
						}
					});
				});
			}else{
				createOtherInfoB(employee);
			}
		}

		function createOtherInfoB(employee){
			var OtherInfoB = Parse.Object.extend("OtherInfoB");
			var query = new OtherInfoB();

			query.set("employeeId", employee.id);

			query.set("question1A", $scope.otherInfoB.question1A.value || null);
			query.set("question1ADetails", $scope.otherInfoB.question1ADetails);
			query.set("question1B", $scope.otherInfoB.question1B.value || null);
			query.set("question1BDetails", $scope.otherInfoB.question1BDetails);

			query.set("question2A", $scope.otherInfoB.question2A.value || null);
			query.set("question2ADetails", $scope.otherInfoB.question2ADetails);

			query.set("question2B", $scope.otherInfoB.question2B.value || null);
			query.set("question2BDetails", $scope.otherInfoB.question2BDetails);

			query.set("question3A", $scope.otherInfoB.question3A.value || null);
			query.set("question3ADetails", $scope.otherInfoB.question3ADetails);

			query.set("question4A", $scope.otherInfoB.question4A.value || null);
			query.set("question4ADetails", $scope.otherInfoB.question4ADetails);

			query.set("question5A", $scope.otherInfoB.question5A.value || null);
			query.set("question5ADetails", $scope.otherInfoB.question5ADetails);
			query.set("question5B", $scope.otherInfoB.question5B.value || null);
			query.set("question5BDetails", $scope.otherInfoB.question5BDetails);

			query.set("question6A", $scope.otherInfoB.question6A.value || null);
			query.set("question6ADetails", $scope.otherInfoB.question6ADetails);

			query.set("question7A", $scope.otherInfoB.question7A.value || null);
			query.set("question7ADetails", $scope.otherInfoB.question7ADetails);
			query.set("question7B", $scope.otherInfoB.question7B.value || null);
			query.set("question7BDetails", $scope.otherInfoB.question7BDetails);
			query.set("question7C", $scope.otherInfoB.question7C.value || null);
			query.set("question7CDetails", $scope.otherInfoB.question7CDetails);

			query.set("referenceName1", $scope.otherInfoB.referenceName1);
			query.set("referenceAddress1", $scope.otherInfoB.referenceAddress1);
			query.set("referenceContactNumber1", $scope.otherInfoB.referenceContactNumber1);

			query.set("referenceName2", $scope.otherInfoB.referenceName2);
			query.set("referenceAddress2", $scope.otherInfoB.referenceAddress2);
			query.set("referenceContactNumber2", $scope.otherInfoB.referenceContactNumber2);

			query.set("referenceName3", $scope.otherInfoB.referenceName3);
			query.set("referenceAddress3", $scope.otherInfoB.referenceAddress3);
			query.set("referenceContactNumber3", $scope.otherInfoB.referenceContactNumber3);

			query.set("govIssuedIdNumber", $scope.otherInfoB.govIssuedIdNumber);
			query.set("govIssuedId", $scope.otherInfoB.govIssuedId);
			query.set("govIssuedDateOfIssuance", new Date($scope.otherInfoB.govIssuedDateOfIssuance));

			query.save(null, {
				success: function(result) {
					showSuccessMsg('Other Info B: Successfully Saved.');
					$state.go('manageEmployees');
				},
				error: function(employee, error) {
					console.log(error);
				}
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

		$scope.statusOfAppointmentList = [
			{label: 'Permanent', value: 'Permanent'},
			{label: 'Temporary', value: 'Temporary'},
			{label: 'Probationary', value: 'Probationary'},
			{label: 'Co-terminus', value: 'Co-terminus'},
			{label: 'Contractual', value: 'Contractual'}
		];

		$scope.confirmList = [
			{label: 'Yes', value: 'Yes'},
			{label: 'No', value: 'No'}
		];

		$scope.confirmListBoolean = [
			{label: 'Yes', value: true},
			{label: 'No', value: false}
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

		$scope.cityList = [
			{label: 'CEBU CITY', value: 'CEBU CITY'},
			{label: 'MANILA', value: 'MANILA'}
		];

		$scope.occupationList = [];
		$scope.degreeCourseList = [];

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
