'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('YourCases', [
    '$scope',
    'STATUS',
    'CaseDetailsService',
    'CaseDiscussionService',
    'securityService',
    'AUTH_EVENTS',
    '$rootScope',
    'TOPCASES_EVENTS',
    '$interval',
    '$timeout',
    function ($scope, STATUS, CaseDetailsService, CaseDiscussionService, securityService, AUTH_EVENTS,$rootScope,TOPCASES_EVENTS, $interval, $timeout) {
    	$scope.CaseDetailsService = CaseDetailsService;
        $scope.displayedCaseNumber = 0;
        $scope.init = function () {
        	CaseDetailsService.getYourCases();
        };
        $scope.fetchCaseDetail = function(kase) {
            $rootScope.$broadcast(TOPCASES_EVENTS.topCaseFetched);
        	CaseDetailsService.getCaseDetails(kase);
            CaseDetailsService.fetCaseHistory(kase);
            CaseDiscussionService.getDiscussionElements(CaseDetailsService.getEightDigitCaseNumber(kase));
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        }
        //Put in interval, for 5 mins so that top cases list will get refreshed
        $interval(function(){
            CaseDetailsService.yourCasesLoading = true;
            CaseDetailsService.getYourCases();
        }.bind(this), 300000);

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });

        $scope.$on(TOPCASES_EVENTS.initialCaseLoad, function () {
            var firstCaseNum = CaseDetailsService.cases[0].resource.caseNumber
            $scope.fetchCaseDetail(firstCaseNum);
        });

        $scope.selectedCase = function(caseNumber) {
            var isSelected = (caseNumber === CaseDetailsService.kase.case_number);

            if (isSelected) {
                return 'selected-case';
            }
            return '';
        };
    }
]);
