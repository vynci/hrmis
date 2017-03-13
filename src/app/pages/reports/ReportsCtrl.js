(function () {
	'use strict';

	angular.module('BlurAdmin.pages.account')
	.controller('ReportsCrtrl', ReportsCrtrl);

	/** @ngInject */
	function ReportsCrtrl($scope, $uibModal, $window, $rootScope, toastr, $state, userService, employeeService, personalInfoService, educationalBackgroundService, civilServiceEligibilityService, workExperienceService) {
		console.log('ReportsCrtrl!');
		if(Parse.User.current()){
			$rootScope.isLogged = true;
			var user = Parse.User.current();
			initialize();

		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

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
			employeeService.getAll()
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

		$scope.parseDate = function(date){
			var dateString = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();

			return dateString;
		}

		$scope.generateReport = function(){
			console.log($scope.selectedReportType);
			console.log($scope.selectedEmployee);
			getWorkExperience($scope.selectedEmployee.selected.value);
		}

		$scope.printReport = function(){
			printTable('service-report-printable');
		}

		function printTable(divName)
		{
			var printContents = document.getElementById(divName).innerHTML;
			var popupWin = window.open('', '_blank', 'width=992,height=768');
			console.log(printContents);

			popupWin.document.open();
			popupWin.document.write('<html><head><link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css"><link rel="stylesheet" href="app/main.css"></head><body onload="window.print()">'+ printContents +'</body></html>');

			popupWin.document.close();
		}

	}


})();
