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
}).value('COMMON_CONFIG', {
    'sfdcOutageMessage': '<ul class="message"><li class="alertSystem">There is currently a scheduled outage to the Case Management areas of the Red Hat Customer Portal.  The case management functions are expected to be unavailable for 9 hours and should return around 9am ET (UTC -0500).  The outage is due to case management infrastructure maintenance.<br/><br/><br/><br/>During the planned outage window, users will not be able to perform any case-related actions, including creating new support cases and updating existing support cases. Other areas of the Customer Portal, including the Knowledgebase and product documentation, will continue to be available.<br/><br/><br/><br/>If you require assistance with your Red Hat Product during the scheduled maintenance outage, please <a target="_blank" href="https://access.redhat.com/support/contact/technicalSupport/">contact Red Hat support</a><br/><br/>We apologize for any inconvenience caused by this scheduled maintenance.</li></ul>',
    'doSfdcHealthCheck' : false,
    'sfdcIsHealthy': false, // This property should be made false only when 'doSfdcHealthCheck' is set to false
    'healthCheckInterval': 60000
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