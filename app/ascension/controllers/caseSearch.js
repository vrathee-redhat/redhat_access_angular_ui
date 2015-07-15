'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseSearch', [
    '$scope',
    '$rootScope',
    'CaseDetailsService',
    'TOPCASES_EVENTS',
    'CaseDiscussionService',
    function ($scope,$rootScope, CaseDetailsService,TOPCASES_EVENTS,CaseDiscussionService) {
    	$scope.caseNumber = '';

    	$scope.searchCases = function(){
            $rootScope.$broadcast(TOPCASES_EVENTS.topCaseFetched);
    		CaseDetailsService.getCaseDetails($scope.caseNumber).then(angular.bind(this, function (){
                CaseDiscussionService.getDiscussionElements(CaseDetailsService.getEightDigitCaseNumber(CaseDetailsService.kase.case_number));
            }), angular.bind(this, function (error) {
                 //nothing to do
            }));
            CaseDetailsService.fetCaseHistory($scope.caseNumber);

    	}
    }
]);
