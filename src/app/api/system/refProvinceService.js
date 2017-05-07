(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('refProvinceService', refProvinceService);

	/** @ngInject */
	function refProvinceService($q) {
		this.getAll = function(cityName, provCode) {
			var defer = $q.defer();
			var RefProvince = Parse.Object.extend("RefProvince");
			var query = new Parse.Query(RefProvince);

			query.limit(1000);

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
