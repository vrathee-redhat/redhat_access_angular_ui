'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('YourCases', [
    '$scope',
    'STATUS',
    'CaseDetailsService',
    'securityService',
    'AUTH_EVENTS',
    function ($scope, STATUS, CaseDetailsService, securityService, AUTH_EVENTS) {
    	$scope.CaseDetailsService = CaseDetailsService;

        $scope.init = function () {
        	CaseDetailsService.getYourcases();
        };
        $scope.fetchCaseDetail = function(kase) {
        	CaseDetailsService.getCaseDetails(kase);
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        }

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });

    }
]);
