'use strict';

angular.module('RedhatAccess.cases')
.controller('SeveritySelect', [
  '$scope',
  'securityService',
  'strataService',
  'CaseService',
  'AlertService',
  function (
    $scope,
    securityService,
    strataService,
    CaseService,
    AlertService) {

    $scope.securityService = securityService;
    $scope.CaseService = CaseService;

    $scope.severitiesLoading = true;
    strataService.values.cases.severity().then(
      function(severities) {
        $scope.severitiesLoading = false;
        CaseService.severities = severities;
      },
      function(error) {
        $scope.severitiesLoading = false;
        AlertService.addStrataErrorMessage(error);
      });
  }
]);
