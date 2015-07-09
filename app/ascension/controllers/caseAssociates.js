'use strict';
angular.module('RedhatAccess.ascension').controller('CaseAssociates', [
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
        $scope.takeOwnership = function () {
            CaseDetailsService.takeOwnership();
        };

    }
]);
