'use strict';

angular.module('RedhatAccessCases')
.controller('CompactCaseList', [
  '$scope',
  '$stateParams',
  'strataService',
  'CaseService',
  function(
      $scope,
      $stateParams,
      strataService,
      CaseService) {

    $scope.cases = [];
    $scope.loadingCaseList = true;

    $scope.itemsPerPage = 5;
    $scope.maxSize = 3;

    $scope.selectPage = function(pageNum) {
      var start = $scope.itemsPerPage * (pageNum - 1);
      var end = start + $scope.itemsPerPage;
      end = end > $scope.cases.length ?
          $scope.cases.length : end;

      $scope.casesOnScreen =
          $scope.cases.slice(start, end);
    };

    $scope.selectedCaseIndex = -1;

    $scope.selectCase = function($index) {
      $scope.selectedCasePage = $scope.currentPage;
      $scope.selectedCaseIndex = $index;

      CaseService.clearCase();
    };

    $scope.filterCases = function() {
      strataService.cases.filter().then(
          function(cases) {
            $scope.loadingCaseList = false;
            $scope.cases = cases;
            $scope.selectPage(1);
          },
          function(error) {
            console.log(error);
          }
      );
    };

    $scope.filterCases();
  }
]);
