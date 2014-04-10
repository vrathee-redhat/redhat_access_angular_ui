'use strict';

angular.module('RedhatAccessCases')
.controller('DescriptionSection', [
  '$scope',
  'CaseService',
  function(
      $scope,
      CaseService) {

    $scope.CaseService = CaseService;
  }
]);
