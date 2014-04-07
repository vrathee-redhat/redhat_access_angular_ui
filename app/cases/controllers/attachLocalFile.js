'use strict';

angular.module('RedhatAccessCases')
.controller('AttachLocalFile', [
  '$scope',
  'attachments',
  'securityService',
  function ($scope, attachments, securityService) {
    $scope.NO_FILE_CHOSEN = 'No file chosen';
    $scope.fileDescription = '';

    $scope.clearSelectedFile = function() {
      $scope.fileName = $scope.NO_FILE_CHOSEN;
      $scope.fileDescription = '';
    };

    $scope.addFile = function() {
      var data = new FormData();
      data.append('file', $scope.fileObj);
      data.append('description', $scope.fileDescription);

      attachments.items.push({
        file_name: $scope.fileName,
        description: $scope.fileDescription,
        length: $scope.fileSize,
        created_by: securityService.loggedInUser,
        created_date: new Date().getTime(),
        file: data
      });

      $scope.clearSelectedFile();
    };

    $scope.getFile = function() {
      $('#fileUploader').click();
    };

    $scope.selectFile = function() {
      $scope.fileObj = $('#fileUploader')[0].files[0];
      $scope.fileSize = $scope.fileObj.size;
      $scope.fileName = $scope.fileObj.name;
      $scope.$apply();
    };

    $scope.clearSelectedFile();
  }
]);
