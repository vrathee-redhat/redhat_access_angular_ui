'use strict';

angular.module('RedhatAccess.cases')
  .controller('CompactCaseList', [
    '$scope',
    '$stateParams',
    'strataService',
    'CaseService',
    '$rootScope',
    'AUTH_EVENTS',
    'securityService',
    'SearchCaseService',
    'AlertService',
    'SearchBoxService',
    'RHAUtils',
    '$filter',
    function (
      $scope,
      $stateParams,
      strataService,
      CaseService,
      $rootScope,
      AUTH_EVENTS,
      securityService,
      SearchCaseService,
      AlertService,
      SearchBoxService,
      RHAUtils,
      $filter) {

      $scope.securityService = securityService;
      $scope.CaseService = CaseService;
      $scope.selectedCaseIndex = -1;
      $scope.SearchCaseService = SearchCaseService;

      $scope.selectCase = function ($index) {
        if ($scope.selectedCaseIndex !== $index) {
          $scope.selectedCaseIndex = $index;
        }
      };

      $scope.domReady = false; //used to notify resizable directive that the page has loaded

      SearchBoxService.doSearch =
        CaseService.onSelectChanged =
        CaseService.onOwnerSelectChanged =
        CaseService.onGroupSelectChanged = function () {
          SearchCaseService.doFilter().then(
            function () {
              if (RHAUtils.isNotEmpty($stateParams.id) && $scope.selectedCaseIndex === -1) {
                var selectedCase =
                  $filter('filter')(
                    SearchCaseService.cases, {
                      'case_number': $stateParams.id
                    });
                $scope.selectedCaseIndex = SearchCaseService.cases.indexOf(selectedCase[0]);
              }

              $scope.domReady = true;
            }
          );
      };

      if (securityService.loginStatus.isLoggedIn) {
        CaseService.populateGroups();
        SearchBoxService.doSearch();
      }

      $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
        CaseService.populateGroups();
        SearchBoxService.doSearch();
        AlertService.clearAlerts();
      });

    }
  ]);