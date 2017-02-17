(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('workExperienceService', workExperienceService);

	/** @ngInject */
	function workExperienceService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var WorkExperienceObject = Parse.Object.extend("WorkExperience");
			var query = new Parse.Query(WorkExperienceObject);

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
