'use strict';

angular.module('RedhatAccess.cases')
.controller('OwnerSelect', [
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

    CaseService.populateUsers();
  }
]);
