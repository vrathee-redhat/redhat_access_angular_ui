/*global angular */
'use strict';
/*global $ */
angular.module('RedhatAccess.common', [
	'RedhatAccess.ui-utils',
	'jmdobry.angular-cache'
]).config(function($angularCacheFactoryProvider) {

}).constant('RESOURCE_TYPES', {
	article: 'Article',
	solution: 'Solution'
}).factory('configurationService', [
	'$q',
	function($q) {
		var defer = $q.defer();
		var service = {
			setConfig: function(config) {
				defer.resolve(config);
			},
			getConfig: function() {
				return defer.promise;
			}
		};
		return service;
	}
]);