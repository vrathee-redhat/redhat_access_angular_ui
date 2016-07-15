'use strict';

export default class DefaultGroup {
    constructor($scope, strataService, CaseService, AlertService, $location, securityService, AUTH_EVENTS, gettextCatalog) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.listEmpty = false;
        $scope.selectedGroup = {};
        $scope.selectedUser = {};
        $scope.usersOnAccount = [];
        $scope.account = null;
        $scope.groups = [];
        $scope.ssoName = null;
        $scope.groupsLoading = true;
        $scope.usersLoading = false;
        $scope.usersLoaded = false;
        $scope.usersAndGroupsFinishedLoading = false;
        $scope.userCanManageDefaultGroups = true;
        $scope.init = function () {
            if (securityService.userAllowedToManageDefaultGroups()) {
                $scope.groupsLoading = true;
                $scope.ssoName = securityService.loginStatus.authedUser.sso_username;
                $scope.account = securityService.loginStatus.account;
                strataService.groups.list($scope.ssoName).then(function (groups) {
                    $scope.groupsLoading = false;
                    $scope.groups = groups;
                    $scope.groups.sort(function (a, b) {
                        if (a.name < b.name) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    });
                }, function (error) {
                    $scope.groupsLoading = false;
                    AlertService.addStrataErrorMessage(error);
                });
            } else {
                $scope.usersLoading = false;
                $scope.groupsLoading = false;
                $scope.userCanManageDefaultGroups = false;
            }
        };

        $scope.validatePage = function () {
            if ($scope.selectedGroup.name !== undefined && $scope.selectedUser.sso_username !== undefined) {
                $scope.usersAndGroupsFinishedLoading = true;
            } else {
                $scope.usersAndGroupsFinishedLoading = false;
            }
        };

        $scope.defaultGroupChanged = function () {
            $scope.usersLoading = true;
            $scope.usersOnAccount = [];
            $scope.selectedUser.sso_username = undefined;
            strataService.accounts.users($scope.account.number, $scope.selectedGroup.number).then(function (users) {
                $scope.usersLoading = false;
                $scope.usersLoaded = true;
                for (var i = 0; i < users.length; i++) {
                    if (users[i].write) {
                        $scope.usersOnAccount.push(users[i]);
                    }
                }
                $scope.usersOnAccount.sort(function (a, b) {
                    if (a.sso_username < b.sso_username) {
                        return -1;
                    }
                    if (a.sso_username > b.sso_username) {
                        return 1;
                    }
                    return 0;
                });
            }, function (error) {
                $scope.usersLoading = false;
                AlertService.addStrataErrorMessage(error);
            });
            $scope.validatePage();
        };

        $scope.setDefaultGroup = function () {
            //Remove old group is_default
            var tmpGroup = {
                name: $scope.selectedGroup.name,
                number: $scope.selectedGroup.number,
                isDefault: true,
                contactSsoName: $scope.selectedUser.sso_username
            };
            strataService.groups.createDefault(tmpGroup).then(function () {
                $scope.usersAndGroupsFinishedLoading = false;
                AlertService.clearAlerts();
                AlertService.addSuccessMessage(gettextCatalog.getString('Successfully set {{groupName}} as {{userName}}\'s default group.', {
                    groupName: tmpGroup.name,
                    userName: $scope.selectedUser.sso_username
                }));

            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.back = function () {
            $location.path('/case/group');
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();

        }
        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });

        $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
            $scope.selectedGroup = {};
            $scope.usersOnScreen = [];
            $scope.usersOnAccount = [];
            $scope.accountNumber = null;
        });
    }
}
