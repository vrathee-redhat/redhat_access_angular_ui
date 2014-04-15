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
    $scope.selectedCaseIndex = -1;

    $scope.selectCase = function($index) {
      $scope.selectedCaseIndex = $index;

      CaseService.clearCase();
    };

    $scope.domReady = false; //used to notify resizable directive that the page has loaded
    $scope.filterCases = function() {
      strataService.cases.filter().then(
          function(cases) {
            $scope.loadingCaseList = false;
            CaseListService.defineCases(cases);
            $scope.domReady = true;
          },
          function(error) {
            console.log(error);
          }
      );
    };

    /**
     * Passed to rha-list-filter as a callback after filtering
     */
    $scope.filterCallback = function() {
      $scope.loadingCaseList = false;
    };

    $scope.onFilter = function() {
      $scope.loadingCaseList = true;
    };

    CaseService.populateGroups();

    $scope.filterCases();
  }
]);
