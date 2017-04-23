(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('refCareerServiceService', refCareerServiceService);

	/** @ngInject */
	function refCareerServiceService($q) {
		this.getAll = function() {
			var defer = $q.defer();
			var RefCareerService = Parse.Object.extend("RefCareerService");
			var query = new Parse.Query(RefCareerService);

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
