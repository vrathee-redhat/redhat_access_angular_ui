'use strict';

angular.module('RedhatAccess.cases')
.controller('OwnerSelect', [
  '$scope',
  'securityService',
  'SearchCaseService',
  'CaseService',
  function (
    $scope,
    securityService,
    SearchCaseService,
    CaseService) {

    $scope.securityService = securityService;
    $scope.SearchCaseService = SearchCaseService;
    $scope.CaseService = CaseService;

    securityService.registerAfterLoginEvent(CaseService.populateUsers);
  }
]);
