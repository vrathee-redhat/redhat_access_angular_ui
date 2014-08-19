'use strict';

angular.module('RedhatAccess.cases')
.controller('TypeSelect', [
  '$scope',
  'securityService',
  'CaseService',
  'strataService',
  'AlertService',
  function (
    $scope,
    securityService,
    CaseService,
    strataService,
    AlertService) {

    $scope.securityService = securityService;
    $scope.CaseService = CaseService;

    $scope.typesLoading = true;
    strataService.values.cases.types().then(
      function(types) {
        $scope.typesLoading = false;
        CaseService.types = types;
      },
      function(error) {
        $scope.typesLoading = false;
        AlertService.addStrataErrorMessage(error);
      });
  }
]);
