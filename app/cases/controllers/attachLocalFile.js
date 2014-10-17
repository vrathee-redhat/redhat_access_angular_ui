'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('AttachLocalFile', [
    '$scope',
    '$sce',
    'RHAUtils',
    'AlertService',
    'AttachmentsService',
    'securityService',
    function ($scope, $sce, RHAUtils,AlertService, AttachmentsService, securityService) {
        $scope.AttachmentsService = AttachmentsService;
        $scope.NO_FILE_CHOSEN = 'No file chosen';
        $scope.fileDescription = '';
        var maxFileSize = 250000000;

        $scope.parseArtifactHtml = function () {
            var parsedHtml = '';
            if (RHAUtils.isNotEmpty(AttachmentsService.suggestedArtifact.description)) {
                var rawHtml = AttachmentsService.suggestedArtifact.description.toString();
                parsedHtml = $sce.trustAsHtml(rawHtml);
            }
            return parsedHtml;
        };
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
                created_by: securityService.loginStatus.authedUser.loggedInUser,
                created_date: new Date().getTime(),
                file: data
            });
            $scope.clearSelectedFile();
        };
        $scope.getFile = function () {
            $('#fileUploader').click();
        };
        $scope.selectFile = function (file) {
            if(file.size !== undefined){
                if(file.size < maxFileSize){
                    $scope.fileObj = file;
                    $scope.fileSize = $scope.fileObj.size;
                    $scope.fileName = $scope.fileObj.name;
                    $scope.$apply();
                } else {
                    AlertService.addDangerMessage(file.name + ' cannot be attached because it is larger the 250MB. Please FTP large files to dropbox.redhat.com.');
                }
                $('#fileUploader')[0].value = '';
            } else {
                $scope.fileObj = file;
                $scope.fileName = file;
                $scope.$apply();
            }
        };

        $('#fileUploader').change(function(e){
            if(e.target.files !== undefined){
                $scope.selectFile(e.target.files[0]);
            } else{
                //$scope.selectFile(e.target.value);

                var frameName = 'fileUploadFormFrame';
                var fileValue;
                var iFrame = document.createElement('iframe');
                iFrame.name = frameName
                document.body.appendChild(iFrame);

                var form = document.createElement('form');
                form.action = 'access.devgssci.devlab.phx1.redhat.com/rs/cases';
                form.method = 'post';
                form.enctype = 'multipart/form-data';
                form.encoding = 'multipart/form-data';
                form.target = frameName;

                var fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.name = 'File';
                fileInput.value = e.target.value;
                fileValue = fileInput.value;

                //all browsers except IE8
                //add event listener to fileInput onChange event -> fileInputChangedCallback

                //IE8 fix
                //add event listener to fileInput onFocus event -> fileInputChangedCallback

                form.appendChild(fileInput);

                document.body.appendChild(form);

                form.submit();
            }
        });
        //$scope.clearSelectedFile();
    }
]);