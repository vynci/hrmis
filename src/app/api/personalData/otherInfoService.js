(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('otherInfoService', otherInfoService);

	/** @ngInject */
	function otherInfoService($q) {

		this.getByEmployeeId = function(employeeId) {
			var defer = $q.defer();
			var OtherInfo = Parse.Object.extend("OtherInfo");
			var query = new Parse.Query(OtherInfo);

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
