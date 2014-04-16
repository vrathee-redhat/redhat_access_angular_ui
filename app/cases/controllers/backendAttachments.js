'use strict';
angular.module('RedhatAccess.cases')
  .controller('BackEndAttachmentsCtrl', ['$scope',
    '$http',
    'AttachmentsService',
    'TreeViewSelectorUtils',
    function ($scope, $http, AttachmentsService, TreeViewSelectorUtils) {
      $scope.name = 'Attachments';
      $scope.attachmentTree = []; //AttachmentsService.backendAttachemnts;
      $scope.init = function () {
        $http({
          method: 'GET',
          url: 'attachments'
        }).success(function (data, status, headers, config) {
          var tree = new Array();
          TreeViewSelectorUtils.parseTreeList(tree, data);
          $scope.attachmentTree = tree;
          AttachmentsService.updateBackEndAttachements(tree);
        }).error(function (data, status, headers, config) {
          console.log("Unable to get supported attachments list");
        });
      };
      $scope.init();
    }
  ]);