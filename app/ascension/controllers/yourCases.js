'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('YourCases', [
    '$scope',
    'STATUS',
    'CaseDetailsService',
    'securityService',
    'AUTH_EVENTS',
    '$rootScope',
    'TOPCASES_EVENTS',
    '$interval',
    function ($scope, STATUS, CaseDetailsService, securityService, AUTH_EVENTS,$rootScope,TOPCASES_EVENTS,$interval) {
    	$scope.CaseDetailsService = CaseDetailsService;

        $scope.init = function () {
        	CaseDetailsService.getYourCases();
        };
        $scope.fetchCaseDetail = function(kase) {
            $rootScope.$broadcast(TOPCASES_EVENTS.topCaseFetched);
        	CaseDetailsService.getCaseDetails(kase);
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

    }
]);
