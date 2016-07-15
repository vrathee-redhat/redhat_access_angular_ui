'use strict';

export default class EmailNotifySelect {
    constructor($scope, CaseService, securityService, AlertService, strataService, CASE_EVENTS, $filter, RHAUtils, EDIT_CASE_CONFIG) {
        'ngInject';

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
        if (CaseService.caseDataReady) {
            CaseService.populateUsers();
        }
        $scope.$on(CASE_EVENTS.received, function () {
            CaseService.populateUsers();
        });

    }
}
