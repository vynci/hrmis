(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('educationalBackgroundService', educationalBackgroundService);

	/** @ngInject */
	function educationalBackgroundService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var EducationalBackgroundObject = Parse.Object.extend("EducationalBackground");
			var query = new Parse.Query(EducationalBackgroundObject);

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
