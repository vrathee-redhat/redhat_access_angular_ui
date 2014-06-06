'use strict';

angular.module('RedhatAccess.cases')
.controller('GroupSelect', [
  '$scope',
  'securityService',
  'SearchCaseService',
  'CaseService',
  'strataService',
  'AlertService',
  function (
    $scope,
    securityService,
    SearchCaseService,
    CaseService,
    strataService,
    AlertService) {

    $scope.securityService = securityService;
    $scope.SearchCaseService = SearchCaseService;
    $scope.CaseService = CaseService;

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
