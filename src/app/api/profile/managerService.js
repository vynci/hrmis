(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('managerService', managerService);

	/** @ngInject */
	function managerService($q) {

		this.getByUserId = function(userId) {
			var defer = $q.defer();
			var ManagerObject = Parse.Object.extend("Manager");
			var query = new Parse.Query(ManagerObject);

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
