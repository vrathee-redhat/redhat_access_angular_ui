'use strict';

angular.module('RedhatAccess.cases')
.controller('StatusSelect', [
  '$scope',
  'securityService',
  'CaseService',
  'STATUS',
  function (
    $scope,
    securityService,
    CaseService,
    STATUS) {

    $scope.securityService = securityService;
    $scope.CaseService = CaseService;
    $scope.STATUS = STATUS;

    $scope.statuses = [
      {
        name: 'Open and Closed',
        value: STATUS.both
      },
      {
        name: 'Open',
        value: STATUS.open
      },
      {
        name: 'Closed',
        value: STATUS.closed
      }
    ];
  }
]);
