'use strict';
angular.module('RedhatAccess.cases').controller('ProductSelect', [
    '$scope',
    'securityService',
    'SearchCaseService',
    'CaseService',
    'strataService',
    'AlertService',
    function ($scope, securityService, SearchCaseService, CaseService, strataService, AlertService) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.productsLoading = true;
        strataService.products.list().then(function (products) {
            $scope.productsLoading = false;
            CaseService.products = products;
        }, function (error) {
            $scope.productsLoading = false;
            AlertService.addStrataErrorMessage(error);
        });
    }
]);