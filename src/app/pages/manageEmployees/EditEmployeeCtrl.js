/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageEmployees')
	.controller('EditEmployeeCtrl', EditEmployeeCtrl);

	/** @ngInject */
	function EditEmployeeCtrl($scope, $uibModal, $rootScope, $state, toastr, $stateParams, employeeService, personalInfoService, familyBackgroundService, educationalBackgroundService, civilServiceEligibilityService, workExperienceService, voluntaryWorkService, trainingProgramsService, otherInfoService, fileReader) {
		$scope.isEdit = true;

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			getPersonalInfo();
			getEmployeeInfo($stateParams.employeeId);
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

		$scope.deletConfirmation = function (page, size) {
			$uibModal.open({
				animation: true,
				templateUrl: 'app/pages/manageEmployees/modals/deleteConfirmation.html',
				controller: 'EditEmployeeCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});
		};

		$scope.showErrorMsg = function(msg) {
			toastr.error(msg, 'Error');
		};

		$scope.openPicture = function (file) {
			var fileInput = document.getElementById('uploadFile');
			fileInput.click();
		}

		$scope.getFile = function (data) {
			console.log(data);
			$scope.personalInfo.avatar = false;
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

		$scope.activateEmployee = function(status){

			if(!$scope.employeeInfo.get('userId')){
				var User = Parse.Object.extend("User");
				var user = new User();

				user.set('username', $scope.personalInfo.emailAddress);
				user.set('password', '12345');
				user.set('email', $scope.personalInfo.emailAddress);
				user.set('userTypeId', 'RiHzyVvs5F');

				user.save(null, {
					success: function(user) {
						// Hooray! Let them use the app now.
						$scope.employeeInfo.set('isActive', true);
						$scope.employeeInfo.set('userId', user.id);
						$scope.employeeInfo.save(null,{
							success : function(result){
								showSuccessMsg('Employee Successfully Activated.');
								$scope.isActive = true;
							},
							error : function(){
								showSuccessMsg('Employee Activation Failed.');
							}
						});
					},
					error: function(user, error) {
						// Show the error message somewhere and let the user try again.
					}
				});
			}else{
				$scope.employeeInfo.set('isActive', status);
				$scope.employeeInfo.save(null,{
					success : function(result){
						if(status){
							showSuccessMsg('Employee Successfully Activated.');
						}else{
							showSuccessMsg('Employee Successfully Deactivated.');
						}
						$scope.isActive = status;
					},
					error : function(){
						showSuccessMsg('Employee Activation Failed.');
					}
				});
			}
		}

		$scope.deleteEmployee = function(){
				console.log('delete employee!');
				var Employee = Parse.Object.extend("Employee");
				var employee = new Employee();

				employee.id = $stateParams.employeeId;

				employee.destroy({
					success: function(myObject) {
						showSuccessMsg('Employee Record Successfully Deleted.');
						$state.go('manageEmployees');
					},
					error: function(myObject, error) {
						// The delete failed.
						// error is a Parse.Error with an error code and message.
					}
				});
		}

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
			var item = $scope.educationalBackground[index];

			if(item.id){
				var EducationalBackground = Parse.Object.extend("EducationalBackground");
				var educationalBackground = new EducationalBackground();

				educationalBackground.id = item.id;

				educationalBackground.destroy({
					success: function(myObject) {
						$scope.educationalBackground.splice(index, 1);
						showSuccessMsg('Educational Background: ' + item.levelType.value + ' Successfully Deleted.');
					},
					error: function(myObject, error) {
						// The delete failed.
						// error is a Parse.Error with an error code and message.
					}
				});

			}else{
				$scope.educationalBackground.splice(index, 1);
			}

		};

		$scope.addEducation = function() {
			$scope.inserted = {};
			$scope.educationalBackground.push($scope.inserted);
		};

		$scope.removeService = function(index){
			var item = $scope.civilService[index];

			if(item.id){
				var InfoClass = Parse.Object.extend("CivilServiceEligibility");
				var query = new InfoClass();

				query.id = item.id;

				query.destroy({
					success: function(myObject) {
						$scope.civilService.splice(index, 1);
						showSuccessMsg('Civil Service: ' + item.careerService + ' Successfully Deleted.');
					},
					error: function(myObject, error) {
						// The delete failed.
						// error is a Parse.Error with an error code and message.
					}
				});

			}else{
				$scope.civilService.splice(index, 1);
			}
		}

		$scope.addService = function(){
			$scope.inserted = {};
			$scope.civilService.push($scope.inserted);
		}

		$scope.removeExperience = function(index){
			var item = $scope.workExperience[index];

			if(item.id){
				var InfoClass = Parse.Object.extend("WorkExperience");
				var query = new InfoClass();

				query.id = item.id;

				query.destroy({
					success: function(myObject) {
						$scope.workExperience.splice(index, 1);
						showSuccessMsg('Work Experience: ' + item.positionTitle + ' Successfully Deleted.');
					},
					error: function(myObject, error) {
						// The delete failed.
						// error is a Parse.Error with an error code and message.
					}
				});

			}else{
				$scope.workExperience.splice(index, 1);
			}
		}

		$scope.addExperience = function(){
			$scope.inserted = {};
			$scope.workExperience.push($scope.inserted);
		}

		$scope.removeVoluntaryWork = function(index){
			var item = $scope.voluntaryWorks[index];

			if(item.id){
				var InfoClass = Parse.Object.extend("VoluntaryWork");
				var query = new InfoClass();

				query.id = item.id;

				query.destroy({
					success: function(myObject) {
						$scope.voluntaryWorks.splice(index, 1);
						showSuccessMsg('Voluntary Work: ' + item.name + ' Successfully Deleted.');
					},
					error: function(myObject, error) {
						// The delete failed.
						// error is a Parse.Error with an error code and message.
					}
				});

			}else{
				$scope.voluntaryWorks.splice(index, 1);
			}

		}

		$scope.addVoluntaryWork = function(){
			$scope.inserted = {};
			$scope.voluntaryWorks.push($scope.inserted);
		}

		$scope.removeTrainingProgram = function(index){
			var item = $scope.trainingPrograms[index];

			if(item.id){
				var InfoClass = Parse.Object.extend("TrainingPrograms");
				var query = new InfoClass();

				query.id = item.id;

				query.destroy({
					success: function(myObject) {
						$scope.trainingPrograms.splice(index, 1);
						showSuccessMsg('Training Program: ' + item.name + ' Successfully Deleted.');
					},
					error: function(myObject, error) {
						// The delete failed.
						// error is a Parse.Error with an error code and message.
					}
				});

			}else{
				$scope.trainingPrograms.splice(index, 1);
			}
		}

		$scope.addTrainingProgram = function(){
			$scope.inserted = {};
			$scope.trainingPrograms.push($scope.inserted);
		}

		$scope.removeOtherInfo = function(index){
			var item = $scope.otherInfo[index];

			if(item.id){
				var InfoClass = Parse.Object.extend("OtherInfo");
				var query = new InfoClass();

				query.id = item.id;

				query.destroy({
					success: function(myObject) {
						$scope.otherInfo.splice(index, 1);
						showSuccessMsg('Other Info: ' + item.name + ' Successfully Deleted.');
					},
					error: function(myObject, error) {
						// The delete failed.
						// error is a Parse.Error with an error code and message.
					}
				});

			}else{
				$scope.otherInfo.splice(index, 1);
			}
		}

		$scope.addOtherInfo = function(){
			$scope.inserted = {};
			$scope.otherInfo.push($scope.inserted);
		}

		function getEmployeeInfo(employeeId){
			employeeService.getById(employeeId)
			.then(function(results) {
				// Handle the result
				console.log(results);
				$scope.employeeInfo = results[0];
				$scope.isActive = $scope.employeeInfo.get('isActive');
			}, function(err) {
				console.log(err);
				$state.go('auth');
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}

		function getPersonalInfo(){
			personalInfoService.getByEmployeeId($stateParams.employeeId)
			.then(function(results) {
				// Handle the result
				var personalInfo = results[0];

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
			familyBackgroundService.getByEmployeeId($stateParams.employeeId)
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

			educationalBackgroundService.getByEmployeeId($stateParams.employeeId)
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

			civilServiceEligibilityService.getByEmployeeId($stateParams.employeeId)
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

			workExperienceService.getByEmployeeId($stateParams.employeeId)
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

			voluntaryWorkService.getByEmployeeId($stateParams.employeeId)
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

			trainingProgramsService.getByEmployeeId($stateParams.employeeId)
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

			otherInfoService.getByEmployeeId($stateParams.employeeId)
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

		$scope.updateEmployee = function(){
			console.log($scope.personalInfo);
			console.log($scope.familyBackground);
			console.log($scope.educationalBackground);
			console.log($scope.civilService);
			console.log($scope.workExperience);
			console.log($scope.voluntaryWorks);
			console.log($scope.trainingPrograms);
			console.log($scope.otherInfo);

			if($scope.personalInfo){
				updatePersonalInfo();
			}

			if($scope.familyBackground){
				updateFamilyBackground();
			}

			if($scope.educationalBackground){
				updateEducationalBackground();
			}

			if($scope.civilService){
				updateCivilService();
			}

			if($scope.workExperience){
				updateWorkExperience();
			}

			if($scope.voluntaryWorks){
				updateVoluntaryWork();
			}

			if($scope.trainingPrograms){
				updateTrainingProgram();
			}

			if($scope.otherInfo){
				updateOtherInfo();
			}
		}

		function updatePersonalInfo(){
			var PersonalInfo = Parse.Object.extend("PersonalInfo");
			var personalInfo = new PersonalInfo();

			personalInfo.id = $scope.personalInfo.id;
			if($scope.profilePictureFile){
				personalInfo.set("avatar",  $scope.profilePictureFile._url);
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

			personalInfo.save(null, {
				success: function(result) {
					// Execute any logic that should take place after the object is saved.

					var Employee = Parse.Object.extend("Employee");
					var employee = new Employee();

					employee.id = $stateParams.employeeId;
					employee.set("firstName", $scope.personalInfo.firstName);
					employee.set("lastName", $scope.personalInfo.lastName);
					employee.set("emailAddress", $scope.personalInfo.emailAddress);

					employee.save(null, {
						success: function(result) {
							// Execute any logic that should take place after the object is saved.
							showSuccessMsg('Personal Information Successfully Saved.');
						},
						error: function(employee, error) {
							console.log(error);
						}
					});
				},
				error: function(employee, error) {
					console.log(error);
				}
			});
		}

		function updateFamilyBackground(){
			var FamilyBackground = Parse.Object.extend("FamilyBackground");
			var familyBackground = new FamilyBackground();
			var children = [];

			familyBackground.id = $scope.familyBackground.id;
			familyBackground.set("employeeId", $stateParams.employeeId);
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
				},
				error: function(employee, error) {
					console.log(error);
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and message.
				}
			});
		}

		function updateEducationalBackground(){
			var lastCountIndicator = 0;

			angular.forEach($scope.educationalBackground, function(value, key) {
				var EducationalBackground = Parse.Object.extend("EducationalBackground");
				var educationalBackground = new EducationalBackground();

				if(value.id){
					educationalBackground.id = value.id;
				}

				educationalBackground.set("employeeId", $stateParams.employeeId);
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
							// $state.go('manageEmployees');
							lastCountIndicator = 0;
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

		function updateCivilService(){
			var lastCountIndicator = 0;

			angular.forEach($scope.civilService, function(value, key) {
				var CivilServiceEligibility = Parse.Object.extend("CivilServiceEligibility");
				var civilServiceEligibility = new CivilServiceEligibility();

				if(value.id){
					civilServiceEligibility.id = value.id;
				}

				civilServiceEligibility.set("employeeId", $stateParams.employeeId);
				civilServiceEligibility.set("careerService", value.careerService);
				civilServiceEligibility.set("rating", parseInt(value.rating));
				civilServiceEligibility.set("examDate", value.examDate);
				civilServiceEligibility.set("examPlace", value.examPlace);
				civilServiceEligibility.set("licenseNumber", value.licenseNumber);
				civilServiceEligibility.set("licenseReleaseDate", value.licenseReleaseDate);

				civilServiceEligibility.save(null, {
					success: function(result) {
						// Execute any logic that should take place after the object is saved.
						showSuccessMsg('Civil Service: ' + value.careerService + ' Successfully Saved.');
						lastCountIndicator = lastCountIndicator + 1;
						if(lastCountIndicator === $scope.civilService.length){
							lastCountIndicator = 0;
						}
					},
					error: function(employee, error) {
						console.log(error);
					}
				});
			});
		}

		function updateWorkExperience(employee){
			var lastCountIndicator = 0;

			angular.forEach($scope.workExperience, function(value, key) {
				var WorkExperience = Parse.Object.extend("WorkExperience");
				var workExperience = new WorkExperience();

				if(value.id){
					workExperience.id = value.id;
				}

				workExperience.set("employeeId", $stateParams.employeeId);
				workExperience.set("positionTitle", value.positionTitle);
				workExperience.set("department", value.department);
				workExperience.set("monthlySalary", parseInt(value.monthlySalary));
				workExperience.set("salaryGrade", value.salaryGrade);
				workExperience.set("statusOfAppointment", value.statusOfAppointment);
				workExperience.set("isGovernmentService", true);
				workExperience.set("inclusiveFromDate", value.inclusiveFromDate);
				workExperience.set("inclusiveToDate", value.inclusiveToDate);

				workExperience.save(null, {
					success: function(result) {
						// Execute any logic that should take place after the object is saved.
						showSuccessMsg('Work Experience: ' + value.positionTitle + ' Successfully Saved.');
						lastCountIndicator = lastCountIndicator + 1;
						if(lastCountIndicator === $scope.workExperience.length){
							lastCountIndicator = 0;
						}
					},
					error: function(employee, error) {
						console.log(error);
					}
				});
			});
		}

		function updateVoluntaryWork(){
			var lastCountIndicator = 0;

			angular.forEach($scope.voluntaryWorks, function(value, key) {
				var VoluntaryWork = Parse.Object.extend("VoluntaryWork");
				var voluntaryWork = new VoluntaryWork();

				if(value.id){
					voluntaryWork.id = value.id;
				}

				voluntaryWork.set("employeeId", $stateParams.employeeId);
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
							// $state.go('manageEmployees');
							lastCountIndicator = 0;
							createTrainingProgram(employee);
						}
					},
					error: function(employee, error) {
						console.log(error);
					}
				});
			});
		}

		function updateTrainingProgram(employee){
			var lastCountIndicator = 0;

			angular.forEach($scope.trainingPrograms, function(value, key) {
				var TrainingPrograms = Parse.Object.extend("TrainingPrograms");
				var trainingPrograms = new TrainingPrograms();

				if(value.id){
					trainingPrograms.id = value.id;
				}

				trainingPrograms.set("employeeId", $stateParams.employeeId);
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
						}
					},
					error: function(employee, error) {
						console.log(error);
					}
				});
			});
		}

		function updateOtherInfo(employee){
			var lastCountIndicator = 0;

			angular.forEach($scope.otherInfo, function(value, key) {
				var OtherInfo = Parse.Object.extend("OtherInfo");
				var otherInfo = new OtherInfo();

				if(value.id){
					otherInfo.id = value.id;
				}

				otherInfo.set("employeeId", $stateParams.employeeId);
				otherInfo.set("specialSkill", value.specialSkill);
				otherInfo.set("nonAcademicRecognition", value.nonAcademicRecognition);
				otherInfo.set("organizationMembership", value.organizationMembership);

				otherInfo.save(null, {
					success: function(result) {
						showSuccessMsg('Training Program: ' + value.name + ' Successfully Saved.');
						lastCountIndicator = lastCountIndicator + 1;
						if(lastCountIndicator === $scope.otherInfo.length){
							lastCountIndicator = 0;
						}
					},
					error: function(employee, error) {
						console.log(error);
					}
				});
			});
		}

}

})();
