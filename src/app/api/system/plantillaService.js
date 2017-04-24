(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('plantillaService', plantillaService);

	/** @ngInject */
	function plantillaService($q) {
		this.getAll = function(cityName, provCode) {
			var defer = $q.defer();
			var Plantilla = Parse.Object.extend("Plantilla");
			var query = new Parse.Query(Plantilla);

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
