'use strict';

export default class ManageGroups {
    constructor($scope, securityService, ManageGroupsService, AUTH_EVENTS) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.ManageGroupsService = ManageGroupsService;
        $scope.canManageGroups = false;

        $scope.init = function () {
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

        // set breadcrumbs
        if (window.chrometwo_require !== undefined) {
            breadcrumbs = [
                ['Support', '/support/'],
                ['Support Cases', '/support/cases/'],
                ['Case Groups']
            ];
            updateBreadCrumb();
        }
    }
}
