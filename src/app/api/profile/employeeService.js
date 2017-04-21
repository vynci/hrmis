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

		this.count = function() {
			var defer = $q.defer();
			var EmployeeObject = Parse.Object.extend("Employee");
			var query = new Parse.Query(EmployeeObject);

			query.count({
				success: function(results) {
					defer.resolve(results);
				},
				error: function(error) {
					defer.reject(error);
				}
			});
			return defer.promise;
		};

		this.getAll = function(search, limit, skip) {
			var defer = $q.defer();

			search = search.split(' ');
			search = search[0];

			var firstName = new Parse.Query("Employee");
			firstName.matches('firstName', search, 'i');

			var lastName = new Parse.Query("Employee");
			lastName.matches('lastName', search, 'i');

			var emailAddress = new Parse.Query("Employee");
			emailAddress.matches('emailAddress', search, 'i');

			var mainQuery = Parse.Query.or(firstName, lastName, emailAddress);

			if(limit){
				mainQuery.limit(limit);
			}

			if(skip){
				mainQuery.skip(skip);
			}

			mainQuery.find({
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
