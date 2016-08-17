'use strict';

export default class ProductSelect {
    constructor($scope, securityService, SearchCaseService, CaseService, ProductsService, strataService, AlertService, RHAUtils, RecommendationsService) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.ProductsService = ProductsService;
        $scope.RecommendationsService = RecommendationsService;
        $scope.products = [];
        $scope.$watch(function () {
            return ProductsService.products;
        }, function () {
            if (RHAUtils.isNotEmpty(ProductsService.products)) {
                $scope.products = ProductsService.products;
                if (RHAUtils.isNotEmpty(CaseService.kase.product)) {
                    let selectedProduct = {
                        code: CaseService.kase.product,
                        name: CaseService.kase.product
                    };
                    let prodInArray = false;
                    for (var i = 0; i < $scope.products.length; i++) {
                        if ($scope.products[i].code === selectedProduct.code && $scope.products[i].name === selectedProduct.name) {
                            prodInArray = true;
                        }
                    }
                    if (!prodInArray) {
                        $scope.products.push(selectedProduct);
                    }
                }
            }
        });

        $scope.onProductSelect = function ($event) {
            CaseService.kase.version="";
            ProductsService.getVersions(CaseService.kase.product);
            CaseService.validateNewCase();
            CaseService.updateLocalStorageForNewCase();
            CaseService.sendCreationStartedEvent($event);
        }
    }
}
