'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('Group', [
    '$scope',
    '$location',
    'securityService',
    'SearchBoxService',
    'GroupService',
    function ($scope, $location, securityService, SearchBoxService, GroupService) {
        $scope.securityService = securityService;
        $scope.onChange = SearchBoxService.onChange = SearchBoxService.doSearch = SearchBoxService.onKeyPress = function () {
            GroupService.reloadTable();
        };
        $scope.$on('$destroy', function () {
            $scope.onChange();
        });
        $scope.defaultCaseGroup = function(){
            $location.path('/case/group/default');
        };
    }
]);