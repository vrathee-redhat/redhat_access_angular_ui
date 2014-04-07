'use strict';

angular.module('RedhatAccessCases')
.controller('CompactEdit', [
  '$scope',
  'caseJSON',
  'attachmentsJSON',
  'commentsJSON',
  function(
      $scope,
      caseJSON,
      attachmentsJSON,
      commentsJSON) {

    $scope.caseJSON = caseJSON;
    $scope.attachments = attachmentsJSON;
    $scope.comments = commentsJSON;
  }
]);
