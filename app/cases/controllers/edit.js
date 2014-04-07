'use strict';

angular.module('RedhatAccessCases')
.controller('Edit', [
  '$scope',
  '$stateParams',
  '$filter',
  '$q',
  'attachments',
  'caseJSON',
  'attachmentsJSON',
  'accountJSON',
  'commentsJSON',
  function(
      $scope,
      $stateParams,
      $filter,
      $q,
      attachments,
      caseJSON,
      attachmentsJSON,
      accountJSON,
      commentsJSON) {

    if (caseJSON) {
      $scope.caseId = $stateParams.id;
      $scope.caseJSON = caseJSON;

      $scope.bugzillas = caseJSON.bugzillas;
      $scope.hasBugzillas = Object.getOwnPropertyNames($scope.bugzillas).length != 0;

      if (caseJSON.recommendations) {
        if (Object.getOwnPropertyNames(caseJSON.recommendations).length != 0) {
          $scope.recommendations = caseJSON.recommendations.recommendation;
        }
      }

      $scope.title = 'Case ' + $scope.caseId;
    }

    $scope.attachments = attachmentsJSON;
    $scope.comments = commentsJSON;



  }]);

