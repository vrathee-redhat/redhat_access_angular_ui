'use strict';
/**
 * Child of Details controller
 **/

angular.module('RedhatAccessCases')
.controller('Recommendations', [
  '$scope',
  function ($scope) {
    $scope.itemsPerPage = 4;
    $scope.maxSize = 10;

    $scope.selectPage = function(pageNum) {
      var start = $scope.itemsPerPage * (pageNum - 1);
      var end = start + $scope.itemsPerPage;
      end = end > $scope.recommendations.length ?
              $scope.recommendations.length : end;

      $scope.recommendationsOnScreen =
        $scope.recommendations.slice(start, end);
    };

    if ($scope.recommendations != null) {
      $scope.selectPage(1);
    }
  }]);

