'use strict';

export default class AccountBookmarkHome {
    constructor($scope, securityService, AUTH_EVENTS, $state, gettextCatalog, COMMON_CONFIG) {
        'ngInject';
        $scope.COMMON_CONFIG = COMMON_CONFIG;
        const init = function () {
            if (!securityService.loginStatus.isLoggedIn || !securityService.loginStatus.authedUser.is_internal) {
                // user not allowed to use this, redirect back to case/list
                $state.go('list');
            } else {
                if (window.chrometwo_require !== undefined) {
                    breadcrumbs = [
                        [gettextCatalog.getString('Support'), '/support/'],
                        [gettextCatalog.getString('Support Cases'), '/support/cases/'],
                        [gettextCatalog.getString('Bookmark Accounts')]
                    ];
                    updateBreadCrumb();
                }
                document.title = gettextCatalog.getString('Portal Case Management');
            }

        };

        $scope.isLoading = function () {
            return securityService.loginStatus.verifying;
        };

        $scope.isLoggedInAndInternal = function () {
            return securityService.loginStatus.isLoggedIn && securityService.loginStatus.authedUser.is_internal;
        };

        if (securityService.loginStatus.isLoggedIn) {
            init();
        }

        $scope.$on(AUTH_EVENTS.loginSuccess, () => init() );
    }
}
