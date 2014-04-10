'use strict';

angular.module('RedhatAccessCases')
.controller('ListAttachments', [
  '$scope',
  'AttachmentsService',
  function ($scope, AttachmentsService) {

    $scope.AttachmentsService = AttachmentsService;
  }
]);
