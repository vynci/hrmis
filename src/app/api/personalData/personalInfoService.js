(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('personalInfoService', personalInfoService);

	/** @ngInject */
	function personalInfoService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var PersonalInfoObject = Parse.Object.extend("PersonalInfo");
			var query = new Parse.Query(PersonalInfoObject);

			if(employeeId){
				query.equalTo("employeeId", employeeId);
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
	}
})();
