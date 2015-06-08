'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseSearch', [
    '$scope',
    'CaseDetailsService',
    function ($scope, CaseDetailsService) {
    	$scope.caseNumber = '';

    	$scope.searchCases = function(){
    		CaseDetailsService.getCaseDetails($scope.caseNumber);
    	}
    }
]);
