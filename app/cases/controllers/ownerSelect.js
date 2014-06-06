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

    $scope.ownersLoading = true;

    var getAccountNumber = function() {
      return strataService.accounts.list().then(
          function(accountNumber) {
            return accountNumber;
          });
    };

    var getUsers = function(accountNumber) {
      return strataService.accounts.users(accountNumber).then(
        function(users) {
          $scope.ownersLoading = false;
          CaseService.owners = users;
        });
    };

    getAccountNumber().then(getUsers);
  }
]);
