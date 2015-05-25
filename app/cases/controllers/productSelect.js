'use strict';
angular.module('RedhatAccess.cases').controller('ProductSelect', [
    '$scope',
    'securityService',
    'SearchCaseService',
    'CaseService',
    'ProductsService',
    'strataService',
    'AlertService',
    'RHAUtils',
    'RecommendationsService',
    function ($scope, securityService, SearchCaseService, CaseService, ProductsService, strataService, AlertService, RHAUtils, RecommendationsService) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.ProductsService = ProductsService;
        $scope.RecommendationsService = RecommendationsService;
        $scope.products = [];
        $scope.$watch(function () {
            return ProductsService.products;
        }, function () {
            if(RHAUtils.isNotEmpty(ProductsService.products)){
                $scope.products = ProductsService.products;
                if(RHAUtils.isNotEmpty(CaseService.kase.product)){
                    var selectedProduct = {
                        code : CaseService.kase.product,
                        name : CaseService.kase.product
                    }
                    var prodInArray = false;
                    for (var i = 0; i < $scope.products.length; i++) {
                        if ($scope.products[i].code === selectedProduct.code && $scope.products[i].name === selectedProduct.name) {
                            prodInArray = true;
                        }
                    }
                    if(!prodInArray){
                        $scope.products.push(selectedProduct);
                    }
                }
            }
        });
    }
]);