(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('localSysAdService', localSysAdService);

	/** @ngInject */
	function localSysAdService($q) {

		this.getByUserId = function(userId) {
			var defer = $q.defer();
			var LocalSysAdObject = Parse.Object.extend("LocalSysAd");
			var query = new Parse.Query(LocalSysAdObject);

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
