'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('SearchBoxService', [
	'$rootScope',
	'CASE_EVENTS',
	'RHAUtils',
	function ($rootScope, CASE_EVENTS, RHAUtils) {
		this.onChange = function(){
			$rootScope.$broadcast(CASE_EVENTS.searchBoxChange);
			if (RHAUtils.isNotEmpty(this.searchTerm)) {
				this.disableSearchButton = false;
			} else {
				this.disableSearchButton = true;
			}
		};
        this.doSearch = function(){
			$rootScope.$broadcast(CASE_EVENTS.searchSubmit);
        };
        this.searchTerm = undefined;
        this.onKeyPress = {};
        this.disableSearchButton = true;
    }
]);
