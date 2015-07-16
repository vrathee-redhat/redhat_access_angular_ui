'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('SearchStackedSolutions', [
    '$scope',
    '$sanitize',
    'strataService',
    'CaseDetailsService',
    'AlertService',
    'SearchService',
    function ($scope, $sanitize, strataService, CaseDetailsService, AlertService, SearchService) {
        $scope.SearchService = SearchService;

        $scope.$watch(function () {
            return CaseDetailsService.kase;
        }, function () {
            $scope.searchStr = undefined;
        });
    }
]);
