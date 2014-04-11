'use strict';
angular.module('RedhatAccessCases')
  .controller('BackEndAttachmentsCtrl', ['$scope',
    '$http',
    'AttachmentsService',
    function ($scope, $http, AttachmentsService) {
      $scope.name = 'Attachments';
      $scope.attachmentTree = [];//AttachmentsService.backendAttachemnts;
      $scope.init = function () {
        console.log("tree init called...");
        $http({
          method: 'GET',
          url: 'attachments'
        }).success(function (data, status, headers, config) {
          //$scope.attachmentTree = data;
          var tree = new Array();
          parseAttachList(tree, data);
          $scope.attachmentTree = tree;
          AttachmentsService.updateBackEndAttachements(tree);
        }).error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      };
      $scope.init();
    }
  ]);