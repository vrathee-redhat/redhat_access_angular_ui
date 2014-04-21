'use strict';

angular.module('RedhatAccess.cases')
.controller('RecommendationsSection', [
  'RecommendationsService',
  '$scope',
  function(
      RecommendationsService,
      $scope) {

    $scope.RecommendationsService = RecommendationsService;

    $scope.recommendationsPerPage = 4;
    $scope.maxRecommendationsSize = 10;

    $scope.selectRecommendationsPage = function(pageNum) {
      var recommendations = RecommendationsService.recommendations;
      var start = $scope.itemsPerPage * (pageNum - 1);
      var end = start + $scope.itemsPerPage;
      end = end > recommendations.length ? recommendations.length : end;
      $scope.recommendationsOnScreen = recommendations.slice(start, end);
    };

    var selectPageOne = function() {
      $scope.selectRecommendationsPage(1);
    };

    RecommendationsService.setPopulateCallback(selectPageOne);
  }
]);
