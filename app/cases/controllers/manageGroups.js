'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ManageGroups', [
    '$scope',
    'securityService',    
    'ManageGroupsService',
    'AUTH_EVENTS',
    'RHAUtils',    
    function ($scope, securityService, ManageGroupsService, AUTH_EVENTS, RHAUtils) {
        $scope.securityService = securityService;
        $scope.ManageGroupsService = ManageGroupsService;
        $scope.canManageGroups = false;

        $scope.init = function() {
            $scope.canManageGroups = securityService.loginStatus.account.has_group_acls && securityService.loginStatus.authedUser.org_admin;
            ManageGroupsService.fetchAccGroupList();
        };        

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        } else {
            $scope.$on(AUTH_EVENTS.loginSuccess, function () {
                $scope.init();
            });
        }
    }
]);