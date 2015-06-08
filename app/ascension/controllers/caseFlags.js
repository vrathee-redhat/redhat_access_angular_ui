'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseFlags', [
    '$scope',
    'CaseDetailsService',
    'securityService',
    'AUTH_EVENTS',
    function ($scope, CaseDetailsService, securityService, AUTH_EVENTS) {
    	$scope.CaseDetailsService = CaseDetailsService;
    	
    	$scope.init = function () {

        };
        
        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        }

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });
    }
]);
