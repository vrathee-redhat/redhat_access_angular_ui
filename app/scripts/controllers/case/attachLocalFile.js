'use strict';

angular.module('RedhatAccessCases')
.controller('AttachLocalFile', [
  '$scope',
  function ($scope) {
    $scope.NO_FILE_CHOSEN = 'No file chosen';
    $scope.fileDescription = '';

//    $scope.attachments = [
//      {
//        uri: "https://access.redhat.com/",
//        file_name: "first.log",
//        description: "The first log",
//        length: 20,
//        created_by: "Chris Kyrouac",
//        created_date: 1393611517000
//      },
//      {
//        uri: "https://access.redhat.com/",
//        file_name: "second.log",
//        description: "The second log",
//        length: 25,
//        created_by: "Chris Kyrouac",
//        created_date: 1393611517000
//      }
//    ];
    $scope.clearSelectedFile = function() {
      $scope.fileName = $scope.NO_FILE_CHOSEN;
      $scope.fileDescription = '';
    };

    $scope.addFile = function() {
      //TODO: populate fields with real data
      $scope.attachments.push({
        file_name: $scope.fileName,
        description: $scope.fileDescription,
        length: $scope.fileSize,
        created_by: "Chris Kyrouac", //TODO: use Lindani's login service to get username
        created_date: new Date().getTime(),
        file: $scope.fileObj
      });

      $scope.clearSelectedFile();
    };

    $scope.getFile = function() {
      $('#fileUploader').click();
    };

    $scope.selectFile = function(input) {
      $scope.fileObj = $('#fileUploader')[0].files[0];
      $scope.fileSize = $scope.fileObj.size;
      $scope.fileName = $scope.fileObj.name;
    };

    $scope.clearSelectedFile();
  }
]);
