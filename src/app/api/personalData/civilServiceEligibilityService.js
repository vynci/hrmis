(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('civilServiceEligibilityService', civilServiceEligibilityService);

	/** @ngInject */
	function civilServiceEligibilityService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var CivilServiceEligibilityObject = Parse.Object.extend("CivilServiceEligibility");
			var query = new Parse.Query(CivilServiceEligibilityObject);

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
