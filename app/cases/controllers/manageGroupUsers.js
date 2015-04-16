'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ManageGroupUsers', [
    '$scope',
    'securityService',
    'SearchBoxService',
    'ManageGroupsService',
    'RHAUtils',
    'translate',
    '$filter',
    'ngTableParams',
    'CASE_EVENTS',
    function ($scope, securityService, SearchBoxService, ManageGroupsService, RHAUtils, translate, $filter, ngTableParams, CASE_EVENTS) {
        $scope.securityService = securityService;
        $scope.ManageGroupsService = ManageGroupsService;
        $scope.usersOnScreen = [];
        $scope.isUsersPrestine = true;
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

        $scope.$watch('ManageGroupsService.usersOnAccount', function (val) {
            if (tableBuilt) {
                $scope.tableParams.reload();
            } else {
                buildTable();
            }            
        }, true);

        var reloadTable = false;
        var tableBuilt = false;
        var buildTable = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10,
                sorting: { sso_username: 'asc' }
            }, {
                total: ManageGroupsService.usersOnAccount.length,
                getData: function ($defer, params) {
                    var orderedData = $filter('filter')(ManageGroupsService.usersOnAccount, SearchBoxService.searchTerm);
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
            ManageGroupsService.saveGroup(undefined,$scope.usersOnScreen);
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
                ManageGroupsService.setDefaultGroup(user);
            }            
        };

    }
]);