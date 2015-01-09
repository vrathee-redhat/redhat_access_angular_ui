'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('SearchBoxService', [
	'$rootScope',
	'CASE_EVENTS',
	function ($rootScope, CASE_EVENTS) {
        this.doSearch = function(){
			$rootScope.$broadcast(CASE_EVENTS.caseSearch);
        };
        this.searchTerm = undefined;
        this.onKeyPress = {};
    }
]);
