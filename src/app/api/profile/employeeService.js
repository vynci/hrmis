(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('employeeService', employeeService);

	/** @ngInject */
	function employeeService($q) {

		this.getByUserId = function(userId) {
			var defer = $q.defer();
			var EmployeeObject = Parse.Object.extend("Employee");
			var query = new Parse.Query(EmployeeObject);

			if(userId){
				query.equalTo("userId", userId);
			}

			query.find({
				success: function(results) {
					defer.resolve(results);
				},
				error: function(error) {
					defer.reject(error);
				}
			});
			return defer.promise;
		};

		this.getById = function(id) {
			var defer = $q.defer();
			var EmployeeObject = Parse.Object.extend("Employee");
			var query = new Parse.Query(EmployeeObject);

			if(id){
				query.equalTo("objectId", id);
			}

			query.find({
				success: function(results) {
					defer.resolve(results);
				},
				error: function(error) {
					defer.reject(error);
				}
			});
			return defer.promise;
		};

		this.getAll = function() {
			var defer = $q.defer();
			var EmployeeObject = Parse.Object.extend("Employee");
			var query = new Parse.Query(EmployeeObject);

			query.find({
				success: function(results) {
					defer.resolve(results);
				},
				error: function(error) {
					defer.reject(error);
				}
			});
			return defer.promise;
		};
	}
})();