/*global angular*/
/*jshint camelcase: false*/
'use strict';
angular.module('RedhatAccess.cases').controller('EmailNotifySelect', [
    '$scope',
    '$rootScope',
    'CaseService',
    'securityService',
    'AlertService',
    'strataService',
    '$filter',
    'RHAUtils',
    'EDIT_CASE_CONFIG',
    'AUTH_EVENTS',
    function ($scope, $rootScope, CaseService, securityService, AlertService, strataService, $filter, RHAUtils, EDIT_CASE_CONFIG, AUTH_EVENTS) {
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.showEmailNotifications = EDIT_CASE_CONFIG.showEmailNotifications;
        $scope.updateNotifyUsers = function () {
            if (!angular.equals(CaseService.updatedNotifiedUsers, CaseService.originalNotifiedUsers)) {
                angular.forEach(CaseService.originalNotifiedUsers, function (origUser) {
                    var updatedUser = $filter('filter')(CaseService.updatedNotifiedUsers, origUser);
                    if (RHAUtils.isEmpty(updatedUser)) {
                        $scope.updatingList = true;
                        strataService.cases.notified_users.remove(CaseService.kase.case_number, origUser).then(function () {
                            $scope.updatingList = false;
                            CaseService.originalNotifiedUsers = CaseService.updatedNotifiedUsers;
                        }, function (error) {
                            $scope.updatingList = false;
                            AlertService.addStrataErrorMessage(error);
                        });
                    }
                });
                angular.forEach(CaseService.updatedNotifiedUsers, function (updatedUser) {
                    var originalUser = $filter('filter')(CaseService.originalNotifiedUsers, updatedUser);
                    if (RHAUtils.isEmpty(originalUser)) {
                        $scope.updatingList = true;
                        strataService.cases.notified_users.add(CaseService.kase.case_number, updatedUser).then(function () {
                            CaseService.originalNotifiedUsers = CaseService.updatedNotifiedUsers;
                            $scope.updatingList = false;
                        }, function (error) {
                            $scope.updatingList = false;
                            AlertService.addStrataErrorMessage(error);
                        });
                    }
                });
            }
        };
        if (securityService.loginStatus.isLoggedIn) {
            CaseService.populateUsers();
        }
        $scope.authEventDeregister = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            CaseService.populateUsers();
        });
        $scope.$on('$destroy', function () {
            $scope.authEventDeregister();
        });
    }
]);
