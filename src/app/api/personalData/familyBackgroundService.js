(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('familyBackgroundService', familyBackgroundService);

	/** @ngInject */
	function familyBackgroundService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var FamilyBackgroundObject = Parse.Object.extend("FamilyBackground");
			var query = new Parse.Query(FamilyBackgroundObject);

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
