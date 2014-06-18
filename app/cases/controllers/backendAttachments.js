'use strict';
angular.module('RedhatAccess.cases')
  .controller('BackEndAttachmentsCtrl', ['$scope', 'TreeViewSelectorData', 'AttachmentsService',
    function ($scope, TreeViewSelectorData, AttachmentsService) {
      $scope.name = 'Attachments';
      $scope.attachmentTree = [];
      
      if (!$scope.rhaDisabled) {
        TreeViewSelectorData.getTree('attachments').then(
          function (tree) {
            $scope.attachmentTree = tree;
            AttachmentsService.updateBackEndAttachments(tree);
          },
          function () {
            console.log('Unable to get tree data');
          });
      }
    }
  ]);
