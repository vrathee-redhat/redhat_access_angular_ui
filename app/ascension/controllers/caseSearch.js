'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseSearch', [
    '$scope',
    '$rootScope',
    'CaseDetailsService',
    'TOPCASES_EVENTS',
    function ($scope,$rootScope, CaseDetailsService,TOPCASES_EVENTS) {
    	$scope.caseNumber = '';

    	$scope.searchCases = function(){
            $rootScope.$broadcast(TOPCASES_EVENTS.topCaseFetched);
    		CaseDetailsService.getCaseDetails($scope.caseNumber);
            CaseDetailsService.fetCaseHistory($scope.caseNumber);
    	}
    }
]);
