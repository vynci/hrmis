(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('systemSettingService', systemSettingService);

	/** @ngInject */
	function systemSettingService($q) {
		this.getById = function(id) {
			var defer = $q.defer();
			var SystemSetting = Parse.Object.extend("SystemSetting");
			var query = new Parse.Query(SystemSetting);

			query.id = id;

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
