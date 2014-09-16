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
        $scope.has_group_acls = false;
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
            GroupService.reloadTable = function () {
                $scope.tableParams.reload();
            };
            tableBuilt = true;
        };
        
        $scope.onMasterCheckboxClicked = function () {
            for (var i = 0; i < GroupService.groupsOnScreen.length; i++) {
                if (this.masterSelected) {
                    GroupService.groupsOnScreen[i].selected = true;
                } else {
                    GroupService.groupsOnScreen[i].selected = false;
                }
            }
        };
        CaseService.clearCase();

        $scope.init = function() {
            strataService.groups.list().then(function (groups) {
                CaseService.groups = groups;
                $scope.has_group_acls = securityService.loginStatus.account.has_group_acls;
                $scope.groupsLoading = false;
                buildTable();
                if(reloadTable){
                    GroupService.reloadTable();
                    reloadTable = false;
                }
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();

        }
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });

        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            CaseService.clearCase();
            $scope.groupsOnScreen = [];
            GroupService.groupsOnScreen = [];
            reloadTable = true;
        });
    }
]);
