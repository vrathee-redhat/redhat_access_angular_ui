'use strict';

angular.module('RedhatAccessCases')
.controller('ListAttachments', [
  '$scope',
  'attachments',
  function ($scope, attachments) {

    $scope.attachments = attachments.items;

    $scope.removeAttachment = function() {
      attachments.items.splice(this.$index, 1);
    };
  }
]);
