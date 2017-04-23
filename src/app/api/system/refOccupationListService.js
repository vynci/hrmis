(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('cityMunicipalityService', cityMunicipalityService);

	/** @ngInject */
	function cityMunicipalityService($q) {
		this.getAll = function(cityName, provCode) {
			var defer = $q.defer();
			var cityMunicipality = Parse.Object.extend("CityMunicipality");
			var query = new Parse.Query(cityMunicipality);

			if(provCode){
				query.equalTo('regDesc', provCode);
			}

			query.matches('citymunDesc', cityName);

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
