'use strict';
/*global $ */
angular.module('RedhatAccess.ascension').controller('LinkedResources', [
    '$scope',
    '$modal',
    'SearchResultsService',
    function ($scope, $modal, SearchResultsService) {
		$scope.SearchResultsService = SearchResultsService;
    }
]);
