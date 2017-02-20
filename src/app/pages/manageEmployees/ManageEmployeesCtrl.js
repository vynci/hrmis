/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageEmployees')
	.controller('ManageEmployeesCtrl', ManageEmployeesCtrl);

	/** @ngInject */
	function ManageEmployeesCtrl($scope, $uibModal, $rootScope, $state, employeeService) {
		console.log('manage employee!');
		if(Parse.User.current()){
			$rootScope.isLogged = true;

			getAllEmployees();
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.enrollEmployee = function(){
			$state.go('enrollEmployee');
		}

		$scope.editEmployee = function(employee){
			console.log(employee.id);
			$state.go('editEmployee', {employeeId: employee.id});
		}

		$scope.smartTablePageSize = 5;
		$scope.employees = [];

		function getAllEmployees(){
			$scope.isLoading = true;			
			employeeService.getAll()
			.then(function(results) {
				// Handle the result
				$scope.employees = results;
				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}



	}

})();
