'use strict';
/*global $ */
/*jshint expr: true, camelcase: false, newcap: false */
angular.module('RedhatAccess.cases').controller('EditGroup', [
    '$scope',
    '$rootScope',
    'strataService',
    'AlertService',
    '$filter',
    'ngTableParams',
    'GroupService',
    'SearchBoxService',
    '$location',
    'securityService',
    'RHAUtils',
    'AUTH_EVENTS',
    function ($scope, $rootScope, strataService, AlertService, $filter, ngTableParams, GroupService, SearchBoxService, $location, securityService, RHAUtils, AUTH_EVENTS) {
        $scope.GroupService = GroupService;
        $scope.listEmpty = false;
        $scope.selectedGroup = {};
        $scope.usersOnScreen = [];
        $scope.usersOnAccount = [];
        $scope.accountNumber = null;
        
        var reloadTable = false;
        var tableBuilt = false;
        var buildTable = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10,
                sorting: { sso_username: 'asc' }
            }, {
                total: $scope.usersOnAccount.length,
                getData: function ($defer, params) {
                    var orderedData = $filter('filter')($scope.usersOnAccount, SearchBoxService.searchTerm);
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    orderedData.length < 1 ? $scope.listEmpty = true : $scope.listEmpty = false;
                    var pageData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $scope.tableParams.total(orderedData.length);
                    $scope.usersOnScreen = pageData;
                    $defer.resolve(pageData);
                }
            });
            GroupService.reloadTable = function () {
                $scope.tableParams.reload();
            };
            tableBuilt = true;
        };
        $scope.init = function() {
            if(securityService.userAllowedToManageGroups()){
                strataService.groups.list().then(function (groups) {
                    for(var i = 0; i < groups.length; i++){
                        var loc = $location.url().split('/');
                        $scope.accountNumber = securityService.loginStatus.account.number;
                        if(loc[3] !== undefined && groups[i].number === loc[3]){
                            $scope.selectedGroup = groups[i];
                            break;
                        }
                    }
                    strataService.accounts.users($scope.accountNumber, $scope.selectedGroup.number).then(function (users) {
                        $scope.usersOnAccount = users;
                        buildTable();
                        $scope.usersLoading = false;
                        if(reloadTable){
                            GroupService.reloadTable();
                            reloadTable = false;
                        }
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }else{
                AlertService.addStrataErrorMessage('User does not have proper credentials to manage case groups.');
            }
        };
        $scope.saveGroup = function () {
            strataService.groups.update($scope.selectedGroup.name, $scope.selectedGroup.number).then(function (response) {
                strataService.groupUsers.update($scope.usersOnAccount, $scope.accountNumber, $scope.selectedGroup.number).then(function(response) {
                    AlertService.addSuccessMessage('Case group successfully updated.');
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.onMasterReadCheckboxClicked = function (masterReadSelected) {
            for(var i = 0; i < $scope.usersOnAccount.length; i++){
                $scope.usersOnAccount[i].access = masterReadSelected;
            }
        };
        
        $scope.onMasterWriteCheckboxClicked = function (masterWriteSelected) {
            for(var i = 0; i < $scope.usersOnAccount.length; i++){
                $scope.usersOnAccount[i].write = masterWriteSelected;
            }
        };

        $scope.writeAccessToggle = function(user){
            if(user.write && !user.access){
                user.access = true;
            }
        };

        $scope.cancel = function(){
            $location.path('/case/group');
        };

        $scope.usersLoading = true;
        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();

        } else {
            $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
                $scope.init();
            });
        }

        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            $scope.selectedGroup = {};
            $scope.usersOnScreen = [];
            $scope.usersOnAccount = [];
            $scope.accountNumber = null;
            reloadTable = true;
        });
    }
]);