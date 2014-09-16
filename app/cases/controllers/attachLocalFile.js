'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('AttachLocalFile', [
    '$scope',
    'AttachmentsService',
    'securityService',
    function ($scope, AttachmentsService, securityService) {
        $scope.AttachmentsService = AttachmentsService;
        $scope.NO_FILE_CHOSEN = 'No file chosen';
        $scope.fileDescription = '';
        $scope.clearSelectedFile = function () {
            $scope.fileName = $scope.NO_FILE_CHOSEN;
            $scope.fileDescription = '';
        };
        $scope.addFile = function () {
            /*jshint camelcase: false */
            var data = new FormData();
            data.append('file', $scope.fileObj);
            data.append('description', $scope.fileDescription);
            AttachmentsService.addNewAttachment({
                file_name: $scope.fileName,
                description: $scope.fileDescription,
                length: $scope.fileSize,
                created_by: securityService.loginStatus.loggedInUser,
                created_date: new Date().getTime(),
                file: data
            });
            $scope.clearSelectedFile();
        };
        $scope.getFile = function () {
            $('#fileUploader').click();
        };
        $scope.selectFile = function () {
            $scope.fileObj = $('#fileUploader')[0].files[0];
            $scope.fileSize = $scope.fileObj.size;
            $scope.fileName = $scope.fileObj.name;
            $scope.$apply();
            $('#fileUploader')[0].value = '';
        };
        $scope.clearSelectedFile();
    }
]);