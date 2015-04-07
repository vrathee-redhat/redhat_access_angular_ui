'use strict';
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('NewRouter', [
    '$scope',
    'securityService',
    'AUTH_EVENTS',
    function ($scope, securityService, AUTH_EVENTS) {
        $scope.shouldRoute = false;

        if (securityService.loginStatus.isLoggedIn) {
            if(securityService.loginStatus.authedUser.account_number !== undefined){
                if(securityService.loginStatus.authedUser.account_number % 2 === 1){
                    $scope.shouldRoute = true;
                }
            }
        }
        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            if(securityService.loginStatus.authedUser.account_number !== undefined){
                if(securityService.loginStatus.authedUser.account_number % 2 === 1){
                    $scope.shouldRoute = true;
                }
            }
        });
    }
]);
