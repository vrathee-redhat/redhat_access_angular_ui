'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('SearchBoxService', [
	'$rootScope',
	'CASE_EVENTS',
	function ($rootScope, CASE_EVENTS) {
		this.onChange = function(){
			$rootScope.$broadcast(CASE_EVENTS.searchBoxChange);
		};
        this.doSearch = function(){
			$rootScope.$broadcast(CASE_EVENTS.searchSubmit);
        };
        this.searchTerm = undefined;
        this.onKeyPress = {};
    }
]);
