(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('hrOfficeSupervisorService', hrOfficeSupervisorService);

	/** @ngInject */
	function hrOfficeSupervisorService($q) {

		this.getByUserId = function(userId) {
			var defer = $q.defer();
			var HROfficeSupervisorObject = Parse.Object.extend("HROfficeSupervisor");
			var query = new Parse.Query(HROfficeSupervisorObject);

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
	}
})();
