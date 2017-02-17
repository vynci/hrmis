(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('voluntaryWorkService', voluntaryWorkService);

	/** @ngInject */
	function voluntaryWorkService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var VoluntaryWorkObject = Parse.Object.extend("VoluntaryWork");
			var query = new Parse.Query(VoluntaryWorkObject);

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
