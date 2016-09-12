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

        $scope.doSearch = () => {
            if ($scope.solrQuery !== null) {
                $scope.$broadcast(CASE_EVENTS.advancedSearchSubmitted);
                AdvancedCaseSearchService.performSearch($scope.solrQuery, CaseService.filterSelect);
            }
        };

        $scope.$watch('CaseService.filterSelect', () => {
            AdvancedCaseSearchService.performSearch(AdvancedCaseSearchService.query, CaseService.filterSelect);
        });
    }
}
