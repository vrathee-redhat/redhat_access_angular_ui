'use strict';

angular.module('RedhatAccess.cases')
.constant('CASE_GROUPS', {
  manage: 'manage',
  ungrouped: 'ungrouped'
})
.controller('GroupSelect', [
  '$scope',
  'securityService',
  'SearchCaseService',
  'CaseService',
  'strataService',
  'AlertService',
  'CASE_GROUPS',
  function (
    $scope,
    securityService,
    SearchCaseService,
    CaseService,
    strataService,
    AlertService,
    CASE_GROUPS) {

    $scope.securityService = securityService;
    $scope.SearchCaseService = SearchCaseService;
    $scope.CaseService = CaseService;
    $scope.CASE_GROUPS = CASE_GROUPS;

    $scope.groupsLoading = true;
    strataService.groups.list().then(
      function(groups) {
        $scope.groupsLoading = false;
        CaseService.groups = groups;
      },
      function(error) {
        $scope.groupsLoading = false;
        AlertService.addStrataErrorMessage(error);
      })
  }
]);
