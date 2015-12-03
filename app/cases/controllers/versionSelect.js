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
    'RHAUtils',
    'CASE_EVENTS',
    function ($scope, securityService, SearchCaseService, CaseService, ProductsService, strataService, AlertService, RecommendationsService, RHAUtils, CASE_EVENTS) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.ProductsService = ProductsService;
        $scope.RecommendationsService = RecommendationsService;
        $scope.versions = [];
        if(RHAUtils.isNotEmpty(CaseService.kase.product)){
            $scope.versions = ProductsService.getVersions(CaseService.kase.product);
        }
        $scope.$on(CASE_EVENTS.productSelectChange, function () {
        if(RHAUtils.isNotEmpty(CaseService.kase.product)){
            ProductsService.getVersions(CaseService.kase.product);
        }
        });
        $scope.$watch(function () {
            return ProductsService.versions;
        }, function () {
            if(RHAUtils.isNotEmpty(ProductsService.versions)){
                $scope.versions = ProductsService.versions;
                if(RHAUtils.isNotEmpty(CaseService.kase.version)){
                    if($scope.versions.indexOf(CaseService.kase.version) === -1){
                        $scope.versions.push(CaseService.kase.version);
                    }
                }
            }
        });
    }
]);