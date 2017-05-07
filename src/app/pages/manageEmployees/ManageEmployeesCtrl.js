/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.manageEmployees')
	.controller('ManageEmployeesCtrl', ManageEmployeesCtrl);

	/** @ngInject */
	function ManageEmployeesCtrl($scope, $uibModal, $rootScope, $state, employeeService, $window, workExperienceService) {
		$scope.totalEmployees = 0;
		$scope.pageLimit = 10;

		if(Parse.User.current()){
			if(Parse.User.current().get('userTypeId') === 'J7ELLa1Czi'){
				$rootScope.isLogged = true;
				getAllEmployees(null, $scope.pageLimit, 0);
			}else{
				Parse.User.logOut().then(function(){
					$window.location.href = "#/auth";
					$state.go('auth');
				});
			}
		}else{
			$rootScope.isLogged = false;
			$state.go('auth');
		}

		$scope.enrollEmployee = function(){
			$state.go('enrollEmployee');
		}

		$scope.editEmployee = function(employee){
			$state.go('editEmployee', {employeeId: employee.id});
		}

		$scope.search = function(){
			getAllEmployees($scope.searchParams, $scope.pageLimit)
		}

		$scope.limitList = function(){
			getAllEmployees($scope.searchParams, $scope.pageLimit)
		}

		$scope.changePage = function(page){
			var skip = page * $scope.pageLimit;
			getAllEmployees($scope.searchParams, $scope.pageLimit, skip);
		}

		$scope.isActive = {
			color : function(status){
				var value = 'success';
				if(!status){
					value = 'danger';
				}
				return value;
			},

			label : function(status){
				var value = 'active';
				if(!status){
					value = 'inactive';
				}
				return value;
			}
		}

		$scope.employees = [];

		function getAllEmployees(search, limit, skip, isSearch){
			$scope.employees = [];
			$scope.isLoading = true;
			employeeService.getAll(search || '', limit, skip)
			.then(function(results) {
				// Handle the result
				// $scope.employees = results;
				countEmployees();

				angular.forEach(results, function(value, key) {
					workExperienceService.getByEmployeeId(value.id)
					.then(function(results) {
						if(results.length > 0){
							value.set('positionTitle', results[0].get('positionTitle'));
							value.set('statusOfAppointment', results[0].get('statusOfAppointment'));
						}else{
							value.set('positionTitle', 'n/a');
							value.set('statusOfAppointment', 'n/a');
						}

						$scope.employees.push(value);
					}, function(err) {
						console.log(err);
					});
				});

				$scope.isLoading = false;
			}, function(err) {
				console.log(err);
			});
		}

		function countEmployees(){
			$scope.isLoading = true;
			employeeService.count()
			.then(function(results) {
				$scope.totalEmployees = results;
				var numberOfPage = $scope.totalEmployees / $scope.pageLimit;
				numberOfPage = Math.ceil(numberOfPage);
				$scope.pageNumbers = [];

				for(var i=0; i<numberOfPage; i++){
					$scope.pageNumbers.push(i);
				}
			}, function(err) {
				console.log(err);
			});
		}



	}

})();
