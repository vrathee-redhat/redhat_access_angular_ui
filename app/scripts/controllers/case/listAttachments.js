'use strict';

angular.module('RedhatAccessCases')
.controller('ListAttachments', [
  '$scope',
  function ($scope) {
    $scope.removeAttachment = function() {
      $scope.attachments.splice(this.$index, 1);
    }
  }
]);
