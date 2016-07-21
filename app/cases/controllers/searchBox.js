'use strict';

export default class SearchBox {
    constructor($rootScope, CASE_EVENTS, $scope, SearchBoxService, securityService) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.SearchBoxService = SearchBoxService;
        $scope.onFilterKeyPress = function ($event) {
            if ($event.keyCode === 13) {
                SearchBoxService.doSearch();
            } else if (angular.isFunction(SearchBoxService.onKeyPress)) {
                SearchBoxService.onKeyPress();
            }
        };
        $scope.clearSearch = function () {
            SearchBoxService.searchTerm = undefined;
            $rootScope.$broadcast(CASE_EVENTS.searchBoxChange);
        };
    }
}
