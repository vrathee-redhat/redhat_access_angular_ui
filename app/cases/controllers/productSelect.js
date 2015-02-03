'use strict';
angular.module('RedhatAccess.cases').controller('ProductSelect', [
    '$scope',
    'securityService',
    'SearchCaseService',
    'CaseService',
    'ProductsService',
    'strataService',
    'AlertService',
    function ($scope, securityService, SearchCaseService, CaseService, ProductsService, strataService, AlertService) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.ProductsService = ProductsService;
    }
]);