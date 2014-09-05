/*jshint camelcase: false */
'use strict';
angular.module('RedhatAccess.cases').constant('CASE_GROUPS', {
    manage: 'manage',
    ungrouped: 'ungrouped'
}).controller('GroupSelect', [
    '$scope',
    'securityService',
    'SearchCaseService',
    'CaseService',
    'strataService',
    'AlertService',
    'CASE_GROUPS',
    'AUTH_EVENTS',
    function ($scope, securityService, SearchCaseService, CaseService, strataService, AlertService, CASE_GROUPS, AUTH_EVENTS) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.CASE_GROUPS = CASE_GROUPS;
        $scope.groupOptions = [];

        var buildGroupOptions = function() {
            CaseService.populateGroups().then(function(groups){
                $scope.groupOptions = [];
                groups.sort(function(a, b){
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                });

                var defaultGroup = '';
                if (!$scope.showsearchoptions) {
                    return;
                }
                var sep = '────────────────────────────────────────';
                $scope.groupOptions.push({
                    value: '',
                    label: 'All Groups'
                }, {
                    value: CASE_GROUPS.ungrouped,
                    label: 'Ungrouped Cases'
                }, {
                    isDisabled: true,
                    label: sep
                });

                angular.forEach(groups, function(group){
                    $scope.groupOptions.push({
                        value: group.number,
                        label: group.name
                    });
                    if(group.is_default) {
                        defaultGroup = group;
                    }
                });

                $scope.groupOptions.push({
                    isDisabled: true,
                    label: sep
                }, {
                    value: CASE_GROUPS.manage,
                    label: 'Manage Case Groups'
                });
                // Assign to default group or '' which will fallback
                // to 'All Groups'
                $scope.CaseService.group = defaultGroup;
            });
        };
        buildGroupOptions();
        $scope.authLoginEvent = $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            buildGroupOptions();
        });

        $scope.$on('$destroy', function () {
            // Clean up listeners
            $scope.authLoginEvent();
        });
    }
]);
