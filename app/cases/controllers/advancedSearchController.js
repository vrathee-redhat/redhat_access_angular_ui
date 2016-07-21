'use strict';

export default class AdvancedSearchController {
    constructor($scope, AdvancedCaseSearchService, RHAUtils, securityService, CaseService, CASE_EVENTS) {
        'ngInject';

        $scope.solrQuery = null;
        $scope.queryParsed = false;
        $scope.AdvancedCaseSearchService = AdvancedCaseSearchService;
        $scope.RHAUtils = RHAUtils;
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;

        $scope.doSearch = function () {
            if ($scope.solrQuery !== null) {
                $scope.$broadcast(CASE_EVENTS.advancedSearchSubmitted);
                AdvancedCaseSearchService.performSearch($scope.solrQuery, CaseService.filterSelect);
            }
        };

        $scope.bottomScrolled = function () {
            if (AdvancedCaseSearchService.query != null && !AdvancedCaseSearchService.searching) {
                AdvancedCaseSearchService.performSearch(AdvancedCaseSearchService.query, CaseService.filterSelect);
            }
        };

        $scope.$watch('CaseService.filterSelect', function () {
            AdvancedCaseSearchService.performSearch(AdvancedCaseSearchService.query, CaseService.filterSelect);
        });
    }
}
