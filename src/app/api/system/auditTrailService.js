(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('auditTrailService', auditTrailService);

	/** @ngInject */
	function auditTrailService($q) {
		this.getAll = function(id) {
			var defer = $q.defer();
			var AuditTrail = Parse.Object.extend("AuditTrail");
			var query = new Parse.Query(AuditTrail);

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
