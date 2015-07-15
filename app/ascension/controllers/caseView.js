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

        $scope.lockCase = function () {
            CaseDetailsService.lockCase();
        };


        $scope.toggleCaseOverView = function(){
            $scope.caseOverView = true;
            $scope.caseDiscussion = false;
            $scope.linkedResources = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
            $scope.accountNotes = false;
        };
        $scope.toggleCaseDiscussion = function(){
          //  CaseDiscussionService.getDiscussionElements(CaseDetailsService.getEightDigitCaseNumber(CaseDetailsService.kase.case_number));
            $scope.caseDiscussion = true;
            $scope.linkedResources = false;
            $scope.caseOverView = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
            $scope.accountNotes = false;
        };
        $scope.toggleCaseSummary= function(){
            $scope.caseSummary = true;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.linkedResources = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
            $scope.accountNotes = false;
        };
        $scope.toggleCaseHistory = function(){
           // CaseDetailsService.fetCaseHistory(CaseDetailsService.kase.case_number);
            $scope.caseHistory = true;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.linkedResources = false;
            $scope.caseSummary = false;
            $scope.bugzillas = false;
            $scope.escalations = false;
            $scope.accountNotes = false;
        };
        $scope.toggleEscalations = function(){
            $scope.escalations = true;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.linkedResources = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.accountNotes = false;
        };

        $scope.toggleLinkedResources = function(){
            $scope.escalations = false;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.linkedResources = true;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.accountNotes = false;
        };

        $scope.toggleAccountNotes = function(){
            $scope.escalations = false;
            $scope.caseOverView = false;
            $scope.caseDiscussion = false;
            $scope.linkedResources = false;
            $scope.caseSummary = false;
            $scope.caseHistory = false;
            $scope.bugzillas = false;
            $scope.accountNotes = true;
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
