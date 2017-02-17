(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('hrDataEncoderService', hrDataEncoderService);

	/** @ngInject */
	function hrDataEncoderService($q) {

		this.getByUserId = function(userId) {
			var defer = $q.defer();
			var HRDataEncoderObject = Parse.Object.extend("HRDataEncoder");
			var query = new Parse.Query(HRDataEncoderObject);

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
