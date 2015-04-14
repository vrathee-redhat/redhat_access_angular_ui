'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('AttachLocalFile', [
    '$scope',
    'AlertService',
    'AttachmentsService',
    'CaseService',
    'securityService',
    'translate',
    'RHAUtils',
    function ($scope, AlertService, AttachmentsService, CaseService, securityService, translate,RHAUtils) {
        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.NO_FILE_CHOSEN = 'No file chosen';
        $scope.fileDescription = '';

        $scope.init = function () {
            AttachmentsService.fetchMaxAttachmentSize();
        };

        $scope.clearSelectedFile = function () {
            $scope.fileName = $scope.NO_FILE_CHOSEN;
            $scope.fileDescription = '';
        };
        $scope.addFile = function () {
            /*jshint camelcase: false */
            var createdDate = RHAUtils.convertToTimezone(new Date());
            AttachmentsService.addNewAttachment({
                file_name: $scope.fileName,
                description: $scope.fileDescription,
                fileObj: $scope.fileObj,
                length: $scope.fileSize,
                created_by: securityService.loginStatus.authedUser.loggedInUser,
                created_date:  RHAUtils.formatDate(createdDate, 'MMM DD YYYY'),
                created_time:  RHAUtils.formatDate(createdDate, 'hh:mm A Z')
            });
            $scope.clearSelectedFile();
            $scope.$apply();
        };
        $scope.getFile = function () {
            $('#fileUploader').click();
        };
        $scope.selectFile = function () {
            // Strata will always keep the limit display in Mb (current = 1024Mb)
            var maxSize = (AttachmentsService.maxAttachmentSize/1024)*1000000000;
            if($('#fileUploader')[0].files[0].size < maxSize){
                $scope.fileObj = $('#fileUploader')[0].files[0];
                $scope.fileSize = $scope.fileObj.size;
                $scope.fileName = $scope.fileObj.name;
                $scope.$apply();
	            $scope.addFile();
            } else {
                AlertService.addDangerMessage($('#fileUploader')[0].files[0].name + ' '+translate('cannot be attached because it is larger than') +''+ (AttachmentsService.maxAttachmentSize/1024) + ' '+ translate('GB. Please FTP large files to dropbox.redhat.com.'));
            }
            $('#fileUploader')[0].value = '';
        };
        $scope.clearSelectedFile();
        $scope.init();
    }
]);
