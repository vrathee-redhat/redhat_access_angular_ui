'use strict';

angular.module('RedhatAccess.cases')
  .controller('ListNewAttachments', [
    '$scope',
    'AttachmentsService',
    'TreeViewSelectorUtils',
    function($scope, AttachmentsService, TreeViewSelectorUtils) {
      $scope.AttachmentsService = AttachmentsService;
      $scope.TreeViewSelectorUtils = TreeViewSelectorUtils;

      $scope.removeLocalAttachment = function($index) {
        AttachmentsService.removeUpdatedAttachment($index);
      };
    }
  ]);