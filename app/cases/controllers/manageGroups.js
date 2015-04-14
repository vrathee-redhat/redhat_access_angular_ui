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
    'RHAUtils',
    'translate',
    '$filter',
    'ngTableParams',
    'CASE_EVENTS',
    function ($scope, $location, securityService, strataService, AlertService, SearchBoxService, GroupService, AUTH_EVENTS, RHAUtils, translate, $filter, ngTableParams, CASE_EVENTS) {
        $scope.securityService = securityService;
        $scope.usersOnScreen = [];
        $scope.usersOnGroup = [];
        $scope.usersLoading = true;
        $scope.groupsLoading = true;
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
        $scope.actionOptions = [
            {
                value: 'rename',
                label: translate('Rename')
            },
            {
                value: 'delete',
                label: translate('Delete')
            },
            {
                value: 'duplicate',
                label: translate('Duplicate')
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
                $scope.sortGroups();
                $scope.selectedGroup = groups[0];
                $scope.groupsLoading = false;
                $scope.loadUsersInGroup($scope.selectedGroup);
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.sortGroups = function() {
            $scope.groupsOnScreen.sort(function(a, b){
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            });
        };

        $scope.loadUsersInGroup = function(group) {
            $scope.selectedGroup = group;
            $scope.isUsersPrestine = true;
            $scope.isGroupPrestine = true;
            $scope.usersLoading = true;
            if(securityService.userAllowedToManageGroups()){                
                strataService.accounts.users($scope.accountNumber,group.number).then(function (users) {
                    $scope.usersOnGroup = users;
                    $scope.manipulateAccess();
                    if (tableBuilt) {
                        $scope.tableParams.reload();
                    } else {
                        buildTable();
                    }   
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
                user.hasDefaultGroup = 'Off';
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
        
        $scope.setUserPermission = function(user) {
            $scope.isUsersPrestine = false;
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
            $scope.saveGroup();
        };

        $scope.createGroup = function () {
            if (RHAUtils.isEmpty($scope.newGroupName)) {
                $scope.newGroupName = 'Untitled Case Group';
            }
            AlertService.addWarningMessage(translate('Creating group') + ' ' + $scope.newGroupName + '...');
            strataService.groups.create($scope.newGroupName, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (success) {
                if(success !== null){
                    $scope.groupsOnScreen.push({
                        name: $scope.newGroupName,
                        number: success
                    });
                    $scope.sortGroups();
                    $scope.selectedGroup = {
                        name: $scope.newGroupName,
                        number: success
                    };
                    $scope.showCreateGroup = false;
                    $scope.newGroupName = '';
                    $scope.loadUsersInGroup($scope.selectedGroup);
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + $scope.newGroupName);                    
                }
            }), function (error) {
                AlertService.clearAlerts();
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.addNewGroup = function() {
            $scope.showCreateGroup = true;
        };

        $scope.setDefaultGroup = function (user) {
            //Remove old group is_default
            user.settingDefaultGroup = true;
            if (user.groupIsdefault === true) {                
                user.groupIsdefault = false;
                user.settingDefaultGroup = false;
                //TODO
                // strata call to remove the default group for the user
            } else {
                var tmpGroup = {
                    name: $scope.selectedGroup.name,
                    number: $scope.selectedGroup.number,
                    isDefault: true,
                    contactSsoName: user.sso_username
                };
                strataService.groups.createDefault(tmpGroup).then(function () {
                    user.groupIsdefault = true;
                    user.settingDefaultGroup = false;
                    AlertService.addSuccessMessage('Successfully set ' + tmpGroup.name + ' as ' + user.sso_username + '\'s default group.');
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }            
        };        

        $scope.groupAction = function(group) {
            if(group.action === 'delete') {
                strataService.groups.remove(group.number, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (success) {
                    var groups = $filter('filter')($scope.groupsOnScreen, function (g) {
                        if (g.number !== group.number) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    $scope.groupsOnScreen = groups;
                    AlertService.addSuccessMessage(translate('Successfully deleted group') + ' ' + group.name);
                }), function (error) {
                    AlertService.clearAlerts();
                    AlertService.addStrataErrorMessage(error);
                });
            }            
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