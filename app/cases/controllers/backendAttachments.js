'use strict';
angular.module('RedhatAccess.cases')
  .controller('BackEndAttachmentsCtrl', ['$scope', 'TreeViewSelectorData',
    function($scope, TreeViewSelectorData) {
      $scope.name = 'Attachments';
      $scope.attachmentTree = [];
      TreeViewSelectorData.getTree('attachments').then(
        function(tree) {
          $scope.attachmentTree = tree;
        },
        function() {
          console.log('Unable to get tree data');
        });
    }
  ]);