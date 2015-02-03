'use strict';
angular.module('RedhatAccess.cases').controller('VersionSelect', [
    '$scope',
    'securityService',
    'SearchCaseService',
    'CaseService',
    'ProductsService',
    'strataService',
    'AlertService',
    'RecommendationsService',
    'CASE_EVENTS',
    function ($scope, securityService, SearchCaseService, CaseService, ProductsService, strataService, AlertService, RecommendationsService, CASE_EVENTS) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.ProductsService = ProductsService;
        $scope.RecommendationsService = RecommendationsService;
        $scope.$on(CASE_EVENTS.productSelectChange, function () {
            ProductsService.getVersions(CaseService.kase.product);
        });
    }
]);