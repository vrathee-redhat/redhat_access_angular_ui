'use strict';
/*jshint camelcase: false, expr: true*/
angular.module('RedhatAccess.cases').controller('PcmRecommendationsController', [
    '$scope',
    '$location',
    'SearchResultsService',
    'SEARCH_CONFIG',
    'securityService',
    'AlertService',
    function ($scope, $location, SearchResultsService, SEARCH_CONFIG, securityService, AlertService) {
        $scope.SearchResultsService = SearchResultsService;
        $scope.results = {};
        $scope.selectedSolution = SearchResultsService.currentSelection;
        $scope.searchInProgress = SearchResultsService.searchInProgress;
        $scope.currentSearchData = SearchResultsService.currentSearchData;
        $scope.itemsPerPage = 3;
        $scope.maxPagerSize = 5;
        $scope.currentPage = 1;
        $scope.selectPage = function (pageNum) {

            var start = $scope.itemsPerPage * (pageNum - 1);
            var end = start + $scope.itemsPerPage;
            end = end > SearchResultsService.results.length ? SearchResultsService.results.length : end;
            $scope.results = SearchResultsService.results.slice(start, end);
        };
        $scope.triggerAnalytics = function ($event) {
            if (window.chrometwo_require !== undefined && $location.path() === '/case/new') {
                chrometwo_require(['analytics/main'], function (analytics) {
                    analytics.trigger('OpenSupportCaseRecommendationClick', $event);
                });
            }
        };
        $scope.$watch(function () {
            return SearchResultsService.currentSelection;
        }, function (newVal) {
            $scope.selectedSolution = newVal;
        });

        $scope.$watch(function () {
            return SearchResultsService.results;
        }, function () {
            $scope.currentPage = 1;
            $scope.selectPage($scope.currentPage);
        }, true);
    }
]);
