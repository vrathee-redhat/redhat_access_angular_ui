'use strict';
/*jshint unused:vars, camelcase:false */
/**
 * @ngdoc module
 * @name
 *
 * @description
 *
 */
angular.module('RedhatAccess.search').controller('SearchController', [
    '$scope',
    '$location',
    'SearchResultsService',
    'SEARCH_CONFIG',
    'securityService',
    'AlertService',
    function ($scope, $location, SearchResultsService, SEARCH_CONFIG, securityService, AlertService) {
        $scope.SearchResultsService = SearchResultsService;
        $scope.results = SearchResultsService.results;
        $scope.selectedSolution = SearchResultsService.currentSelection;
        $scope.searchInProgress = SearchResultsService.searchInProgress;
        $scope.currentSearchData = SearchResultsService.currentSearchData;
        $scope.itemsPerPage = 3;
        $scope.maxPagerSize = 10;
        $scope.selectPage = function (pageNum) {
            var start = $scope.itemsPerPage * (pageNum - 1);
            var end = start + $scope.itemsPerPage;
            end = end > SearchResultsService.results.length ? SearchResultsService.results.length : end;
            $scope.results = SearchResultsService.results.slice(start, end);
        };
        $scope.getOpenCaseRef = function () {
            if (SEARCH_CONFIG.openCaseRef !== undefined) {
                //TODO data may be complex type - need to normalize to string in future
                return SEARCH_CONFIG.openCaseRef + '?data=' + SearchResultsService.currentSearchData.data;
            } else {
                return '#/case/new?data=' + SearchResultsService.currentSearchData.data;
            }
        };
        $scope.solutionSelected = function (index) {
            var response = $scope.results[index];
            SearchResultsService.setSelected(response, index);
        };
        $scope.search = function (searchStr, limit) {
            SearchResultsService.search(searchStr, limit);
        };
        $scope.diagnose = function (data, limit) {
            SearchResultsService.diagnose(data, limit);
        };
        $scope.triggerAnalytics = function ($event) {
            if (this.isopen && window.chrometwo_require !== undefined && $location.path() === '/case/new') {
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
    }
]);
