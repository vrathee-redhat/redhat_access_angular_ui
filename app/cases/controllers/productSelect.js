'use strict';
angular.module('RedhatAccess.cases').controller('ProductSelect', [
    '$scope',
    'securityService',
    'SearchCaseService',
    'CaseService',
    'ProductsService',
    'strataService',
    'AlertService',
    'RecommendationsService',
    function ($scope, securityService, SearchCaseService, CaseService, ProductsService, strataService, AlertService, RecommendationsService) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.ProductsService = ProductsService;
        $scope.RecommendationsService = RecommendationsService;
    }
]);