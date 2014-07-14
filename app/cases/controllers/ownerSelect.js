'use strict';

angular.module('RedhatAccess.cases')
.controller('OwnerSelect', [
  '$scope',
  '$rootScope',
  'securityService',
  'AUTH_EVENTS',
  'SearchCaseService',
  'CaseService',
  function (
    $scope,
    $rootScope,
    securityService,
    AUTH_EVENTS,
    SearchCaseService,
    CaseService) {

    $scope.securityService = securityService;
    $scope.SearchCaseService = SearchCaseService;
    $scope.CaseService = CaseService;

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      CaseService.populateUsers();
  });
}
]);
