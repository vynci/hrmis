(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('refDegreeCourseService', refDegreeCourseService);

	/** @ngInject */
	function refDegreeCourseService($q) {
		this.getAll = function() {
			var defer = $q.defer();
			var RefDegreeCourse = Parse.Object.extend("RefDegreeCourse");
			var query = new Parse.Query(RefDegreeCourse);

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
