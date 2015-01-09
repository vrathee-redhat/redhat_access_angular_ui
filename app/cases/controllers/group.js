'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('Group', [
    '$scope',
    '$rootScope',
    '$location',
    'securityService',
    'SearchBoxService',
    'GroupService',
    'CASE_EVENTS',
    function ($scope, $rootScope, $location, securityService, SearchBoxService, GroupService, CASE_EVENTS) {
        $scope.securityService = securityService;

        $scope.doChangeDeregister = $rootScope.$on(CASE_EVENTS.searchBoxChange, function () {
            $scope.onChange();
        });
        $scope.doSearchDeregister = $rootScope.$on(CASE_EVENTS.searchSubmit, function () {
            $scope.onChange();
        });
        $scope.onChange = function () {
            GroupService.reloadTable();
        };
        SearchBoxService.onKeyPress = function () {
            GroupService.reloadTableAndClearPagination();
        };
        $scope.$on('$destroy', function () {
            $scope.onChange();
        });
        $scope.defaultCaseGroup = function(){
            $location.path('/case/group/default');
        };
        $scope.$on('$destroy', function () {
            $scope.doSearchDeregister();
            $scope.doChangeDeregister();
        });
    }
]);