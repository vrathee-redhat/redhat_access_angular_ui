'use strict';
/*global $ */
/*jshint expr: true, camelcase: false, newcap: false */
angular.module('RedhatAccess.cases').controller('EditGroup', [
    '$scope',
    '$rootScope',
    'strataService',
    'CaseService',
    'AlertService',
    '$filter',
    'ngTableParams',
    'GroupUserService',
    'SearchBoxService',
    '$location',
    'securityService',
    'RHAUtils',
    'AUTH_EVENTS',
    'translate',
    function ($scope, $rootScope, strataService, CaseService, AlertService, $filter, ngTableParams, GroupUserService, SearchBoxService, $location, securityService, RHAUtils, AUTH_EVENTS, translate) {
        $scope.GroupUserService = GroupUserService;
        $scope.CaseService = CaseService;
        $scope.listEmpty = false;
        $scope.selectedGroup = {};
        $scope.usersOnScreen = [];
        $scope.usersOnAccount = [];
        $scope.accountNumber = null;
        $scope.isUsersPrestine = true;
        $scope.isGroupPrestine = true;
        
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
            $scope.tableParams.settings().$scope = $scope;
            GroupUserService.reloadTable = function () {
                $scope.tableParams.reload();
            };
            tableBuilt = true;
        };
        $scope.init = function() {
            if(securityService.userAllowedToManageGroups()){
                SearchBoxService.searchTerm='';
                var loc = $location.url().split('/');
                $scope.accountNumber = securityService.loginStatus.authedUser.account_number;
                strataService.groups.get(loc[3]).then(function (group) {
                    $scope.selectedGroup = group;
                    strataService.accounts.users($scope.accountNumber, $scope.selectedGroup.number).then(function (users) {
                        $scope.usersOnAccount = users;
                        buildTable();
                        $scope.usersLoading = false;
                        if(reloadTable){
                            //GroupUserService.reloadTable();
                            reloadTable = false;
                        }
                    }, function (error) {
                        $scope.usersLoading = false;
                        AlertService.addStrataErrorMessage(error);
                    });
                }, function (error) {
                    $scope.usersLoading = false;
                    AlertService.addStrataErrorMessage(error);
                });
            }else{
                $scope.usersLoading = false;
                AlertService.addStrataErrorMessage(translate('User does not have proper credentials to manage case groups.'));
            }
        };
        $scope.saveGroup = function () {
            if(!$scope.isGroupPrestine){
                strataService.groups.update($scope.selectedGroup.name, $scope.selectedGroup.number).then(function (response) {
                    AlertService.addSuccessMessage(translate('Case group successfully updated.'));
                    $scope.isGroupPrestine = true;
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }
            if(!$scope.isUsersPrestine){
                strataService.groupUsers.update($scope.usersOnAccount, $scope.accountNumber, $scope.selectedGroup.number).then(function(response) {
                    $scope.isUsersPrestine = true;
                    AlertService.addSuccessMessage(translate('Case users successfully updated.'));
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }
        };

        $scope.onMasterReadCheckboxClicked = function (masterReadSelected) {
            for(var i = 0; i < $scope.usersOnAccount.length; i++){
                $scope.usersOnAccount[i].access = masterReadSelected;
            }
            $scope.isUsersPrestine = false;
        };
        
        $scope.onMasterWriteCheckboxClicked = function (masterWriteSelected) {
            for(var i = 0; i < $scope.usersOnAccount.length; i++){
                $scope.usersOnAccount[i].write = masterWriteSelected;
            }
            $scope.isUsersPrestine = false;
        };

        $scope.writeAccessToggle = function(user){
            if(user.write && !user.access){
                user.access = true;
            }
            $scope.isUsersPrestine = false;
        };

        $scope.cancel = function(){
            $location.path('/case/group');
        };

        $scope.toggleUsersPrestine = function(){
            $scope.isUsersPrestine = false;
        };

        $scope.toggleGroupPrestine = function(){
            $scope.isGroupPrestine = false;
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

        $scope.$on('$destroy', function () {
            $scope.authEventLogoutSuccess();
        });
    }
]);