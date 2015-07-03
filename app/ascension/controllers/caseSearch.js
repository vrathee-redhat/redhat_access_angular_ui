'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseSearch', [
    '$scope',
    'CaseDetailsService',
    function ($scope, CaseDetailsService) {
    	$scope.caseNumber = '';

    	$scope.searchCases = function(){
            $rootScope.$broadcast(TOPCASES_EVENTS.topCaseFetched);
    		CaseDetailsService.getCaseDetails($scope.caseNumber);
    	}
    }
]);
