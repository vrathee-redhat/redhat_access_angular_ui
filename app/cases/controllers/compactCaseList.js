'use strict';

angular.module('RedhatAccess.cases')
.controller('CompactCaseList', [
  '$scope',
  '$stateParams',
  'strataService',
  'CaseService',
  'CaseListService',
  '$rootScope',
  'AUTH_EVENTS',
  'securityService',
  'AlertService',
  '$filter',
  function(
      $scope,
      $stateParams,
      strataService,
      CaseService,
      CaseListService,
      $rootScope,
      AUTH_EVENTS,
      securityService,
      AlertService,
      $filter) {

    $scope.securityService = securityService;
    $scope.CaseService = CaseService;
    $scope.CaseListService = CaseListService;
    $scope.loadingCaseList = true;
    $scope.selectedCaseIndex = -1;

    $scope.selectCase = function($index) {
      if ($scope.selectedCaseIndex != $index) {
        $scope.selectedCaseIndex = $index;
        CaseService.clearCase();
      }
    };

    $scope.domReady = false; //used to notify resizable directive that the page has loaded
    $scope.filterCases = function() {
      strataService.cases.filter().then(
          function(cases) {
            $scope.loadingCaseList = false;
            CaseListService.defineCases(cases);

            if ($stateParams.id != null && $scope.selectedCaseIndex == -1) {
              var selectedCase =
                  $filter('filter')(
                      CaseListService.cases,
                      {'case_number': $stateParams.id});
              $scope.selectedCaseIndex = CaseListService.cases.indexOf(selectedCase[0]);
            }

            $scope.domReady = true;
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
          }
      );
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      CaseService.populateGroups();
      $scope.filterCases();
      AlertService.clearAlerts();
    });

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
