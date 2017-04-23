(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('refOccupationListService', refOccupationListService);

	/** @ngInject */
	function refOccupationListService($q) {
		this.getAll = function(cityName, provCode) {
			var defer = $q.defer();
			var RefOccupationList = Parse.Object.extend("RefOccupationList");
			var query = new Parse.Query(RefOccupationList);

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
