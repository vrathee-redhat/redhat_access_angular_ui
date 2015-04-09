'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ManageGroups', [
    '$scope',
    '$location',
    'securityService',
    'strataService',
    'AlertService',
    'SearchBoxService',
    'GroupService',
    'AUTH_EVENTS',
    'translate',
    '$filter',
    'ngTableParams',
    'CASE_EVENTS',
    function ($scope, $location, securityService, strataService, AlertService, SearchBoxService, GroupService, AUTH_EVENTS, translate, $filter, ngTableParams, CASE_EVENTS) {
        $scope.securityService = securityService;
        $scope.usersOnScreen = [];
        $scope.usersOnGroup = [];
        $scope.usersLoading = true;
        $scope.groupsLoading = true;
        $scope.masterSelected = false;
        $scope.userSelected = false;
        $scope.isUsersPrestine = true;
        $scope.isGroupPrestine = true;
        $scope.listEmpty = false;
        $scope.showCreateGroup = false;
        $scope.newGroupName = '';
        $scope.accessOptions = [
            {
                value: 'READ',
                label: translate('Read Only')
            },
            {
                value: 'WRITE',
                label: translate('Read and Write')
            },
            {
                value: 'NONE',
                label: translate('No access')
            }
        ];

        var reloadTable = false;
        var tableBuilt = false;
        var buildTable = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10,
                sorting: { sso_username: 'asc' }
            }, {
                total: $scope.usersOnGroup.length,
                getData: function ($defer, params) {
                    var orderedData = $filter('filter')($scope.usersOnGroup, SearchBoxService.searchTerm);
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    orderedData.length < 1 ? $scope.listEmpty = true : $scope.listEmpty = false;
                    var pageData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $scope.tableParams.total(orderedData.length);
                    $scope.usersOnScreen = pageData;
                    $defer.resolve(pageData);
                }
            });
            $scope.tableParams.settings().$scope = $scope;
            tableBuilt = true;
        };

        $scope.$on(CASE_EVENTS.searchBoxChange, function () {
            $scope.tableParams.reload();
        });

        $scope.init = function() {
            $scope.groupsLoading = true;
            $scope.canManageGroups = securityService.loginStatus.account.has_group_acls && securityService.loginStatus.authedUser.org_admin;
            $scope.accountNumber = securityService.loginStatus.authedUser.account_number;
            var userName = securityService.loginStatus.authedUser.sso_username;
            strataService.groups.list(userName, false).then(function (groups) {
                $scope.groupsOnScreen = groups;
                $scope.selectedGroup = groups[0];
                $scope.groupsLoading = false;
                $scope.loadUsersInGroup($scope.selectedGroup);
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.loadUsersInGroup = function(group) {
            $scope.selectedGroup = group;
            $scope.usersLoading = true;
            if(securityService.userAllowedToManageGroups()){                
                strataService.accounts.users($scope.accountNumber,group.number).then(function (users) {
                    $scope.usersOnGroup = users;
                    $scope.manipulateAccess();
                    buildTable();
                    $scope.usersLoading = false;
                }, function (error) {
                    $scope.usersLoading = false;
                    AlertService.addStrataErrorMessage(error);
                });
            } else {
                $scope.usersLoading = false;
                AlertService.addStrataErrorMessage(translate('User does not have proper credentials to manage case groups.'));
            }
        };

        $scope.manipulateAccess = function () {
            angular.forEach($scope.usersOnGroup, angular.bind(this, function (user) {
                if (user.write === true || user.org_admin === true) {
                    user.permission = 'WRITE';
                } else if (user.access === true && user.write === false) {
                    user.permission = 'READ';
                } else if (user.access === false && user.write === false) {
                    user.permission = 'NONE';
                }
            }));
        };

        $scope.saveGroup = function () {
            var userName = securityService.loginStatus.authedUser.sso_username;
            if(!$scope.isGroupPrestine){
                strataService.groups.update($scope.selectedGroup, userName).then(function (response) {
                    AlertService.addSuccessMessage(translate('Case group successfully updated.'));
                    $scope.isGroupPrestine = true;
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }
            if(!$scope.isUsersPrestine){
                strataService.groupUsers.update($scope.usersOnScreen, $scope.accountNumber, $scope.selectedGroup.number).then(function(response) {
                    $scope.isUsersPrestine = true;
                    AlertService.addSuccessMessage(translate('Case users successfully updated.'));
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }
        };

        $scope.onMasterCheckboxClicked = function (masterSelected) {
            for(var i = 0; i < $scope.usersOnScreen.length; i++){
                if (!$scope.usersOnScreen[i].org_admin) {
                    $scope.usersOnScreen[i].userSelected = masterSelected;
                }
            }
            $scope.isUsersPrestine = false;
        };

        $scope.toggleUsersPrestine = function() {
            $scope.isUsersPrestine = false;
        };

        $scope.setUserPermission = function(user) {
            for(var i = 0; i < $scope.usersOnScreen.length; i++){
                if ($scope.usersOnScreen[i].sso_username === user.sso_username) {
                    if (user.permission === 'WRITE') {
                        user.write = true;
                        user.access = true;
                    } else if (user.permission === 'READ') {
                        user.write = false;
                        user.access = true;
                    } else if (user.permission === 'NONE') {
                        user.write = false;
                        user.access = false;
                    }
                    break;
                }
            }
        };

        $scope.createGroup = function () {
            AlertService.addWarningMessage(translate('Creating group') + ' ' + $scope.newGroupName + '...');
            strataService.groups.create($scope.newGroupName, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (success) {
                if(success !== null){
                    $scope.usersOnGroup.push({
                        name: $scope.newGroupName,
                        number: success
                    });
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + $scope.newGroupName);
                    
                } 
                //else {
                //     CaseService.populateGroups(securityService.loginStatus.authedUser.sso_username, true).then(angular.bind(this, function (groups) {
                //         AlertService.clearAlerts();
                //         AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + $scope.newGroupName);
                //         GroupService.reloadTable();
                //     }), function (error) {
                //         AlertService.clearAlerts();
                //         AlertService.addStrataErrorMessage(error);
                //     });
                // }
            }), function (error) {
                AlertService.clearAlerts();
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.addNewGroup = function() {
            $scope.showCreateGroup = true;
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