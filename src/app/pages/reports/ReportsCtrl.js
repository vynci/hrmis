(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('ReportsCrtrl', ReportsCrtrl);

	/** @ngInject */
	function ReportsCrtrl($scope, $uibModal, $window, $rootScope, toastr, $state, userService, employeeService, personalInfoService, educationalBackgroundService, civilServiceEligibilityService, workExperienceService, systemSettingService) {
		console.log('ReportsCrtrl!');

		$scope.dateNow = new Date();

		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
			initialize();

		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
		];

		function initialize(){
			getAllEmployees();
			$scope.reportTypes = [
				{label: 'Service Records', value: 1},
				{label: 'Test Report #1', value: 2},
				{label: 'Test Report #2', value: 3},
			];
			$scope.selectedReportType = {};
			$scope.selectedEmployee = {};
			$scope.employees = [];
		}

		function getAllEmployees(){
			employeeService.getAll('', null, null)
			.then(function(results) {
				// Handle the result
				angular.forEach(results, function(value, key) {
					$scope.employees.push({
						label : value.get('firstName') + ' ' + value.get('lastName'),
						value : value.id,
					});
				});

			}, function(err) {
				console.log(err);
			});
		}

		function getSystemSetting(){
			systemSettingService.getById('rfeNg7kJH2')
			.then(function(results) {
				// Handle the result
				$scope.inCharge = results[0].get('serviceRecordInCharge');
			}, function(err) {
				console.log(err);
			});
		}


		function getWorkExperience(id){
			$scope.isLoading = true;

			workExperienceService.getByEmployeeId(id)
			.then(function(results) {
				$scope.workExperiences = results;
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getCivilService(id){
			civilServiceEligibilityService.getByEmployeeId(id)
			.then(function(results) {
				// Handle the result
				$scope.civilService = results[0].get('careerService');
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getEducationalBackground(id){
			educationalBackgroundService.getByEmployeeId(id)
			.then(function(results) {
				// Handle the result
				$scope.educationalBackground = results[results.length - 1].get('degreeCourse');
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
			});
		}

		function getPersonalInfo(id){
			personalInfoService.getByEmployeeId(id)
			.then(function(results) {
				// Handle the result
				$scope.personalInfo = {
					firstName : results[0].get('firstName'),
					lastName : results[0].get('lastName'),
					middleName : results[0].get('middleName'),
					birthPlace : results[0].get('birthPlace'),
					birthDate : results[0].get('birthDate'),
					civilStatus : results[0].get('civilStatus')
				};
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}

		$scope.parseDate = function(date){
			var dateString = '';
			if(date){
				dateString = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
			}

			return dateString;
		}

		$scope.parseDateMonthWord = function(date){
			var dateString = '';
			if(date){
				dateString = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
			}

			return dateString;
		}

		$scope.generateReport = function(){
			console.log($scope.selectedReportType);
			console.log($scope.selectedEmployee);
			getWorkExperience($scope.selectedEmployee.selected.value);
			getCivilService($scope.selectedEmployee.selected.value);
			getPersonalInfo($scope.selectedEmployee.selected.value);
			getEducationalBackground($scope.selectedEmployee.selected.value);
			getSystemSetting();
			$scope.isReportGenerated = true;
		}

		$scope.printReport = function(){
			printTable('service-report-printable');
		}

		function printTable(divName)
		{
			var printContents = document.getElementById(divName).innerHTML;
			var popupWin = window.open('', '_blank', 'width=992,height=768');

			popupWin.document.open();
			popupWin.document.write('<html><head><link rel="stylesheet" href="styles/vendor-ac7f6b898b.css"><link rel="stylesheet" href="styles/app-27df361a72.css""></head><body onload="window.print()">'+ printContents +'</body></html>');

			popupWin.document.close();
		}

	}


})();
