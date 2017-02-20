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

		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.enrollEmployee = function(){
			$state.go('enrollEmployee');
		}

		$scope.editEmployee = function(id){
			console.log(id);
			$state.go('editEmployee');
		}

		$scope.smartTablePageSize = 5;
		$scope.employees = [];


		employeeService.getAll()
		.then(function(results) {
			// Handle the result
			console.log(results);
			$scope.employees = results;
		}, function(err) {
			console.log(err);
		}, function(percentComplete) {
			console.log(percentComplete);
		});


	}

})();
