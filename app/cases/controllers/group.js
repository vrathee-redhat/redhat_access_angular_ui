'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('Group', [
    '$scope',
    '$location',
    'securityService',
    'SearchBoxService',
    'GroupService',
    'CASE_EVENTS',
    function ($scope, $location, securityService, SearchBoxService, GroupService, CASE_EVENTS) {
        $scope.securityService = securityService;

        $scope.$on(CASE_EVENTS.searchBoxChange, function () {
            $scope.onChange();
        });
        $scope.$on(CASE_EVENTS.searchSubmit, function () {
            $scope.onChange();
        });
        $scope.onChange = function () {
            GroupService.reloadTable();
        };
        SearchBoxService.onKeyPress = function () {
            GroupService.reloadTableAndClearPagination();
        };
        $scope.defaultCaseGroup = function(){
            $location.path('/case/group/default');
        };
    }
]);