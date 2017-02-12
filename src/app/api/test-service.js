/**
* @author v.lugovsky
* created on 03.05.2016
*/
(function () {
	'use strict';

	angular.module('BlurAdmin.api')
	.service('vinceTest', vinceTest);

	/** @ngInject */
	function vinceTest($q) {

		this.userType = function(id) {
			var defer = $q.defer();
			var UserTypeObject = Parse.Object.extend("UserType");
			var query = new Parse.Query(UserTypeObject);

			if(id){
				query.equalTo("objectId", id);
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

		this.getById = function(id) {
			var defer = $q.defer();
			var UserObject = Parse.Object.extend("User");
			var query = new Parse.Query(UserObject);

			if(id){
				query.equalTo("objectId", id);
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

		this.hasAttr = function (elem, attrName) {
			var attr = $(elem).attr(attrName);
			return (typeof attr !== typeof undefined && attr !== false);
		}
}
})();
