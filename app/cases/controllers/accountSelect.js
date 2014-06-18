'use strict';
/*global $ */

angular.module('RedhatAccess.cases')
.controller('AccountSelect', [
  '$scope',
  'strataService',
  'AlertService',
  'CaseService',
  function ($scope, strataService, AlertService, CaseService) {

    $scope.CaseService = CaseService;

    $scope.selectUserAccount = function() {
      $scope.loadingAccountNumber = true;
      strataService.accounts.list().then(
        function(response) {
          $scope.loadingAccountNumber = false;
          CaseService.account.number = response;         
        },
        function(error) {
          $scope.loadingAccountNumber = false;
          AlertService.addStrataErrorMessage(error);
        });
    };
  }
]);
