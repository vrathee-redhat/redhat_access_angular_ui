'use strict';
angular.module('RedhatAccess.ascension').controller('CaseView', [
    '$scope',
    '$location',
    'RHAUtils',
    'AUTH_EVENTS',
    'AlertService',
    'securityService',
    'HeaderService',
    'gettextCatalog',
    'CaseDetailsService',
    'CaseDiscussionService',
    'TOPCASES_EVENTS',
    function ($scope, $location, RHAUtils, AUTH_EVENTS, AlertService, securityService, HeaderService, gettextCatalog, CaseDetailsService,CaseDiscussionService,TOPCASES_EVENTS) {
        $scope.securityService = securityService;
        $scope.HeaderService = HeaderService;
        $scope.CaseDetailsService = CaseDetailsService;
        $scope.CaseDiscussionService=CaseDiscussionService;
        $scope.securityService = securityService;
        $scope.caseOverView = true;

        $scope.init = function () {
        };

        $scope.closeCase = function () {
            CaseDetailsService.closeCase();
        };

        $scope.toggleCaseOverView = function(){
            $scope.caseOverView = true;
            $scope.caseDiscussion = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
        };
        $scope.toggleCaseDiscussion = function(){
            var caseNumber=CaseDetailsService.kase.case_number;
            if(CaseDetailsService.kase.case_number.toString().length < 8) {
                 caseNumber = '0'+CaseDetailsService.kase.case_number;
            }
            CaseDiscussionService.getDiscussionElements(caseNumber,false);
            $scope.caseDiscussion = true;
            $scope.caseOverView = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
        };
        $scope.toggleCaseSummary= function(){
            $scope.caseSummary = true;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
        };
        $scope.toggleCaseHistory = function(){
            CaseDetailsService.fetCaseHistory(CaseDetailsService.kase.case_number);
            $scope.caseHistory = true;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.caseSummary = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
        };
        $scope.toggleBugzillas = function(){
            $scope.bugzillas = true;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.escalations = false;
        };
        $scope.toggleEscalations = function(){
            $scope.escalations = true;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        }

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();

        });

        $scope.$on(TOPCASES_EVENTS.topCaseFetched, function () {
            $scope.toggleCaseOverView();
        });
    }
]);
