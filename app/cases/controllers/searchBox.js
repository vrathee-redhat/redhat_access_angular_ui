'use strict';
angular.module('RedhatAccess.cases').controller('SearchBox', [
    '$scope',
    'SearchBoxService',
    'securityService',
    function ($scope, SearchBoxService, securityService) {
        $scope.securityService = securityService;
        $scope.SearchBoxService = SearchBoxService;
        $scope.onFilterKeyPress = function ($event) {
            if ($event.keyCode === 13) {
                SearchBoxService.doSearch();
            } else if (angular.isFunction(SearchBoxService.onKeyPress)) {
                SearchBoxService.onKeyPress();
            }
        };
    }
]);