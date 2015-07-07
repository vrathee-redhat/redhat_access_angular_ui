'use strict';
/*global $ */
angular.module('RedhatAccess.ascension').controller('AttachFile', [
    '$scope',
    'AlertService',
    'CaseAttachmentsService',
    'CaseDetailsService',
    'securityService',
    'gettextCatalog',
    'RHAUtils',
    function ($scope, AlertService, CaseAttachmentsService, CaseDetailsService, securityService, gettextCatalog,RHAUtils) {
        $scope.CaseAttachmentsService = CaseAttachmentsService;
        $scope.CaseDetailsService = CaseDetailsService;
        $scope.NO_FILE_CHOSEN = 'No file chosen';
        $scope.fileDescription = '';

        $scope.init = function () {
            CaseAttachmentsService.fetchMaxAttachmentSize();
        };

        $scope.clearSelectedFile = function () {
            $scope.fileName = $scope.NO_FILE_CHOSEN;
            $scope.fileDescription = '';
        };
        $scope.addFile = function () {
            /*jshint camelcase: false */
            var createdDate = RHAUtils.convertToTimezone(new Date());
            console.log("isnide add file");
            CaseAttachmentsService.addNewAttachment({
                file_name: $scope.fileName,
                description: $scope.fileDescription,
                fileObj: $scope.fileObj,
                length: $scope.fileSize,
                created_by: securityService.loginStatus.authedUser.loggedInUser,
                created_date:  RHAUtils.formatDate(createdDate, 'MMM DD YYYY'),
                created_time:  RHAUtils.formatDate(createdDate, 'hh:mm A Z')
            });
            $scope.clearSelectedFile();
            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                $scope.$apply();
            }
        };
        $scope.getFile = function () {
            $('#fileUploader').click();
        };
        $scope.selectFile = function () {
            console.log("isnide select file");
            // Strata will always keep the limit display in Mb (current = 1024Mb)
            var maxSize = (CaseAttachmentsService.maxAttachmentSize/1024)*1000000000;
            if($('#fileUploader')[0].files[0].size < maxSize){
                $scope.fileObj = $('#fileUploader')[0].files[0];
                $scope.fileSize = $scope.fileObj.size;
                $scope.fileName = $scope.fileObj.name;
                if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                    $scope.$apply();
                }
	            $scope.addFile();
            } else {
                var message=gettextCatalog.getString("{{errorFileName}} cannot be attached because it is larger than {{errorFileSize}} GB. Please FTP large files to dropbox.redhat.com.",{errorFileName:$('#fileUploader')[0].files[0].name,errorFileSize:(CaseAttachmentsService.maxAttachmentSize/1024)});
                AlertService.addDangerMessage(message);
            }
            $('#fileUploader')[0].value = '';
        };
        $scope.clearSelectedFile();
        $scope.init();
    }
]);
