'use strict';

export default class AttachLocalFile {
    constructor($scope, AlertService, AttachmentsService, CaseService, securityService, RHAUtils, gettextCatalog) {
        'ngInject';

        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.NO_FILE_CHOSEN = 'No file chosen';
        $scope.fileDescription = '';
        $scope.attachFileTT = '';

        $scope.init = async function () {
            AttachmentsService.fetchMaxAttachmentSize();
            $scope.attachFileTT = AttachmentsService.isValidS3Upload() ? 'Can now accept large attachments (~5TB)' : '';
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
                created_by: securityService.loginStatus.authedUser.last_name + ', ' + securityService.loginStatus.authedUser.first_name,
                last_modified_by: securityService.loginStatus.authedUser.last_name + ', ' + securityService.loginStatus.authedUser.first_name,
                created_date: RHAUtils.formatDate(createdDate, 'MMM DD YYYY'),
                created_time: RHAUtils.formatDate(createdDate, 'hh:mm A Z')
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
            const minSize = 0;
            const maxSize = (AttachmentsService.maxAttachmentSize / 1024) * 1000000000;
            const file = $('#fileUploader')[0].files[0];
            const greaterThanMin = file.size > minSize;
            const lessThanMax = file.size < maxSize;
            if ((file && greaterThanMin && lessThanMax) || (file && greaterThanMin && AttachmentsService.isValidS3Upload())) {
                $scope.fileObj = file;
                $scope.fileSize = $scope.fileObj.size;
                $scope.fileName = $scope.fileObj.name;

                // Check if file is readable
                const reader = new FileReader();
                reader.onload = () => {
                    $scope.addFile();
                };
                reader.onerror = () => {
                    const message = gettextCatalog.getString('{{errorFileName}} cannot be read by the browser. Check your privileges and make sure you are allowed to read the file.', {
                        errorFileName: file.name
                    });
                    AlertService.addDangerMessage(message);
                    if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                        $scope.$apply();
                    }
                }
                reader.readAsArrayBuffer(file.slice(0,10)); // try reading first 10 bytes
            } else if (file && file.size === minSize) {
                var message = gettextCatalog.getString("{{errorFileName}} cannot be attached because it is a 0 byte file.", {errorFileName: file.name});
                AlertService.addDangerMessage(message);
            } else if (file) {
                var message = gettextCatalog.getString("{{errorFileName}} cannot be attached because it is larger than {{errorFileSize}} GB. Please FTP large files to dropbox.redhat.com.", {
                    errorFileName: file.name,
                    errorFileSize: (AttachmentsService.maxAttachmentSize / 1024)
                });
                AlertService.addDangerMessage(message);
            }

            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                $scope.$apply();
            }

            $('#fileUploader')[0].value = '';
        };
        $scope.clearSelectedFile();
        $scope.init();
    }
}
