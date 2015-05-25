'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseDetails', [
    '$scope',
    'CaseDetailsService',
    'securityService',
    'AUTH_EVENTS',
    function ($scope, CaseDetailsService, securityService, AUTH_EVENTS) {
    	$scope.CaseDetailsService = CaseDetailsService;
    	
    	$scope.init = function () {
            CaseDetailsService.getCaseDetails(CaseDetailsService.cases[0]);
        };
        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        }

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });
    }
]);
