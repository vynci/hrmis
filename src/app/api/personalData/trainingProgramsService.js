(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('trainingProgramsService', trainingProgramsService);

	/** @ngInject */
	function trainingProgramsService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var TrainingProgramsObject = Parse.Object.extend("TrainingPrograms");
			var query = new Parse.Query(TrainingProgramsObject);

			if(employeeId){
				query.equalTo("employeeId", employeeId);
			}

			query.descending('from');

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
