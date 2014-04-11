'use strict';

angular.module('RedhatAccessCases')
.controller('CompactCaseList', [
  '$scope',
  '$stateParams',
  'strataService',
  'CaseService',
  'CaseListService',
  function(
      $scope,
      $stateParams,
      strataService,
      CaseService,
      CaseListService) {

    $scope.CaseService = CaseService;
    $scope.CaseListService = CaseListService;
    $scope.loadingCaseList = true;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 3;

    $scope.selectPage = function(pageNum) {
      var start = $scope.itemsPerPage * (pageNum - 1);
      var end = start + $scope.itemsPerPage;
      end = end > CaseListService.cases.length ?
          CaseListService.cases.length : end;

      $scope.casesOnScreen =
          CaseListService.cases.slice(start, end);
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
            CaseListService.defineCases(cases);
            $scope.selectPage(1);
          },
          function(error) {
            console.log(error);
          }
      );
    };

    /**
     * Passed as a param to rha-list-filter as a callback after filtering
     */
    $scope.filterCallback = function() {
      $scope.selectPage(1);
      $scope.loadingCaseList = false;
    };

    $scope.onFilter = function() {
      $scope.loadingCaseList = true;
    };

    CaseService.populateGroups();

    $scope.filterCases();
  }
]);
