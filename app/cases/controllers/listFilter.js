'use strict';
 /*jshint camelcase: false */
angular.module('RedhatAccess.cases')
.controller('ListFilter', [
  '$scope',
  'STATUS',
  'CaseService',
  'securityService',
  function ($scope,
            STATUS,
            CaseService,
            securityService) {

    $scope.securityService = securityService;
    CaseService.status = STATUS.both;
  }
]);
