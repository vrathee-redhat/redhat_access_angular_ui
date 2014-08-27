'use strict';
/*global $ */
/*jshint expr: true, newcap: false*/
angular.module('RedhatAccess.cases').controller('GroupList', [
    '$scope',
    'strataService',
    'AlertService',
    'CaseService',
    '$filter',
    'ngTableParams',
    'GroupService',
    'SearchBoxService',
    function ($scope, strataService, AlertService, CaseService, $filter, ngTableParams, GroupService, SearchBoxService) {
        $scope.CaseService = CaseService;
        $scope.GroupService = GroupService;
        $scope.listEmpty = false;
        $scope.groupsOnScreen = [];
        var tableBuilt = false;
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
        $scope.groupsLoading = true;
        strataService.groups.list().then(function (groups) {
            CaseService.groups = groups;
            buildTable();
            $scope.groupsLoading = false;
        }, function (error) {
            AlertService.addStrataErrorMessage(error);
        });
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
    }
]);
