'use strict';
/*global $ */
/*jshint expr: true, camelcase: false, newcap: false*/
angular.module('RedhatAccess.cases').controller('GroupList', [
    '$rootScope',
    '$scope',
    'strataService',
    'AlertService',
    'CaseService',
    '$filter',
    'ngTableParams',
    'GroupService',
    'securityService',
    'SearchBoxService',
    'AUTH_EVENTS',
    function ($rootScope, $scope, strataService, AlertService, CaseService, $filter, ngTableParams, GroupService, securityService, SearchBoxService, AUTH_EVENTS) {
        $scope.CaseService = CaseService;
        $scope.GroupService = GroupService;
        $scope.listEmpty = false;
        $scope.groupsOnScreen = [];
        $scope.canManageGroups = false;
        var reloadTable = false;
        var tableBuilt = false;
        $scope.groupsLoading = true;
        var buildTable = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10,
                sorting: { name: 'asc' }
            }, {
                total: CaseService.groups.length,
                getData: function ($defer, params) {
                    var orderedData = $filter('filter')(CaseService.groups, SearchBoxService.searchTerm);
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    orderedData.length < 1 ? $scope.listEmpty = true : $scope.listEmpty = false;
                    var pageData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $scope.tableParams.total(orderedData.length);
                    GroupService.groupsOnScreen = pageData;
                    $defer.resolve(pageData);
                }
            });
            $scope.tableParams.settings().$scope = $scope;
            GroupService.reloadTable = function () {
                $scope.tableParams.reload();
            };
            GroupService.reloadTableAndClearPagination = function () {
                if($scope.tableParams !== undefined){
                    $scope.tableParams.$params.page = 1;
                }
                $scope.tableParams.reload();
            };
            tableBuilt = true;
        };
        
        $scope.onMasterCheckboxClicked = function () {
            for (var i = 0; i < GroupService.groupsOnScreen.length; i++) {
                if (this.masterSelected) {
                    GroupService.groupsOnScreen[i].selected = true;
                    GroupService.disableDeleteGroup = false;
                } else {
                    GroupService.groupsOnScreen[i].selected = false;
                    GroupService.disableDeleteGroup = true;
                }
            }
        };
        CaseService.clearCase();

        $scope.init = function() {
            strataService.groups.list().then(function (groups) {
                CaseService.groups = groups;
                $scope.canManageGroups = securityService.loginStatus.account.has_group_acls && securityService.loginStatus.authedUser.org_admin;
                $scope.groupsLoading = false;
                buildTable();
                if(reloadTable){
                    //GroupService.reloadTable();
                    reloadTable = false;
                }
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        $scope.onGroupSelected = function() {
            var disableDeleteGroup = true;
            for (var i = 0; i < GroupService.groupsOnScreen.length; i++) {
                if (GroupService.groupsOnScreen[i].selected === true) {
                    disableDeleteGroup = false;
                    break;
                }
            }
            GroupService.disableDeleteGroup = disableDeleteGroup;
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();

        }
        $scope.authEventLogin = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });

        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            CaseService.clearCase();
            $scope.groupsOnScreen = [];
            GroupService.groupsOnScreen = [];
            reloadTable = true;
        });

        $scope.$on('$destroy', function () {
            CaseService.clearCase();
            $scope.authEventLogoutSuccess();
            $scope.authEventLogin();
        });
    }
]);
