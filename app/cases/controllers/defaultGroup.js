'use strict';
/*global $ */
/*jshint expr: true, camelcase: false, newcap: false */
angular.module('RedhatAccess.cases').controller('DefaultGroup', [
    '$scope',
    '$rootScope',
    'strataService',
    'CaseService',
    'AlertService',
    '$location',
    'securityService',
    'AUTH_EVENTS',
    'translate',
    function ($scope, $rootScope, strataService, CaseService, AlertService, $location, securityService, AUTH_EVENTS, translate) {
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.listEmpty = false;
        $scope.selectedGroup = {};
        $scope.selectedUser = {};
        $scope.usersOnAccount = [];
        $scope.account = null;
        $scope.groups = [];
        $scope.ssoName = null;
        $scope.groupsLoading = false;
        $scope.usersLoading = false;
        $scope.usersLoaded = false;
        $scope.usersAndGroupsFinishedLoading = false;
        
        $scope.init = function() {
            if(securityService.userAllowedToManageGroups()){
                $scope.groupsLoading = true;
                var loc = $location.url().split('/');
                $scope.ssoName = securityService.loginStatus.authedUser.sso_username;
                $scope.account = securityService.loginStatus.account;
                strataService.groups.list($scope.ssoName).then(function (groups) {
                    $scope.groupsLoading = false;
                    $scope.groups = groups;
                    $scope.groups.sort(function(a, b){
                        if(a.name < b.name) { return -1; }
                        if(a.name > b.name) { return 1; }
                        return 0;
                    });
                }, function (error) {
                    $scope.groupsLoading = false;
                    AlertService.addStrataErrorMessage(error);
                });
            }else{
                $scope.usersLoading = false;
                $scope.groupsLoading = false;
                AlertService.addStrataErrorMessage(translate('User does not have proper credentials to manage default groups.'));
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
                for (var i=0; i<users.length; i++) {
                    if (users[i].write) {
                        $scope.usersOnAccount.push(users[i]);
                    }
                }
                $scope.usersOnAccount.sort(function(a, b){
                    if(a.sso_username < b.sso_username) { return -1; }
                    if(a.sso_username > b.sso_username) { return 1; }
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
                AlertService.addSuccessMessage('Successfully set ' + tmpGroup.name + ' as ' + $scope.selectedUser.sso_username + '\'s default group.');
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.back = function(){
            $location.path('/case/group');
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();

        }
        $scope.authEventLogin = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });

        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            $scope.selectedGroup = {};
            $scope.usersOnScreen = [];
            $scope.usersOnAccount = [];
            $scope.accountNumber = null;
        });

        $scope.$on('$destroy', function () {
            $scope.authEventLogoutSuccess();
            $scope.authEventLogin();
        });
    }
]);