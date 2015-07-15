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
    		var promise=CaseDetailsService.getCaseDetails($scope.caseNumber);
            promise.then(angular.bind(this, function (){
                CaseDiscussionService.getDiscussionElements(CaseDetailsService.getEightDigitCaseNumber(CaseDetailsService.kase.case_number));
            }), angular.bind(this, function (error) {

            }));
            CaseDetailsService.fetCaseHistory($scope.caseNumber);

    	}
    }
]);
