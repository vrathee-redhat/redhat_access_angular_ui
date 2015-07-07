'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseAttachmentsService', [
    '$q',
    '$sce',
    '$state',
    '$location',
    'RHAUtils',
    'strataService',
    'AlertService',
    'CaseDetailsService',
    'gettextCatalog',
    function ( $q, $sce, $state,  $location, RHAUtils, strataService,  AlertService, CaseDetailsService, gettextCatalog) {
        this.originalAttachments = [];
        this.updatedAttachments = [];
        this.suggestedArtifact = {};
        this.proceedWithoutAttachments = false;
        this.maxAttachmentSize;
        this.clear = function () {
            this.originalAttachments = [];
            this.updatedAttachments = [];
            this.suggestedArtifact = {};
        };


        this.removeUpdatedAttachment = function ($index) {
            this.updatedAttachments.splice($index, 1);
        };
        this.removeOriginalAttachment = function (attachment) {
            //TODO uuid is not available in UDS endpoint I have raised an issue
            var progressMessage = AlertService.addWarningMessage(gettextCatalog.getString('Deleting attachment: {{attachmentName}}',{attachmentName:attachment.resource.name}));
            strataService.cases.attachments.remove(attachment.resource.uuid, CaseDetailsService.kase.case_number).then(angular.bind(this, function () {
                AlertService.removeAlert(progressMessage);
                AlertService.addSuccessMessage(gettextCatalog.getString('Successfully deleted attachment:{{attachmentName}}',{attachmentName:attachment.resource.name}));
                var i = 0;
                for(i; i < this.originalAttachments.length; i++){
                    if(this.originalAttachments[i].resource.uuid === attachment.resource.uuid){
                        break;
                    }
                }
                this.originalAttachments.splice(i, 1);
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
        this.addNewAttachment = function (attachment) {

            this.updatedAttachments.push(attachment);

        };
        this.defineOriginalAttachments = function (attachments) {
            if (!angular.isArray(attachments)) {
                this.originalAttachments = [];
            } else {
                this.originalAttachments = attachments;
            }
        };
        this.updateAttachments = function (caseId) {
            var hasLocalAttachments = !angular.equals(this.updatedAttachments.length, 0);
            if (hasLocalAttachments) {
                var promises = [];
                var updatedAttachments = this.updatedAttachments;
                if (hasLocalAttachments) {
                    //find new attachments
                    angular.forEach(updatedAttachments, function (attachment) {
                        if (!attachment.hasOwnProperty('uuid')) {
                            var formdata = new FormData();
                            formdata.append('file', attachment.fileObj);
                            formdata.append('description', attachment.description);
                            var promise = strataService.cases.attachments.post(formdata, caseId);
                            promise.then(function (uri) {
                                attachment.resource={};
                                attachment.resource.url = uri;
                                attachment.resource.uuid = uri.slice(uri.lastIndexOf('/') + 1);
                                var currentDate =new Date();
                                var lastModifiedDate = RHAUtils.convertToTimezone(currentDate);
                                attachment.resource.sortModifiedDate=RHAUtils.formatDate(RHAUtils.convertToMoment(currentDate),'');
                                attachment.resource.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                                attachment.resource.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                                attachment.resource.name=attachment.fileObj.name;
                                attachment.resource.size=attachment.fileObj.size;
                                attachment.resource.type=attachment.fileObj.type;

                                AlertService.clearAlerts();
                                AlertService.addSuccessMessage(gettextCatalog.getString('Successfully uploaded attachment {{attachmentFileName}} to case {{caseNumber}}',{attachmentFileName:attachment.resource.name,caseNumber:caseId}));
                            }, function (error) {

                                    AlertService.addStrataErrorMessage(error);

                            });
                            promises.push(promise);
                        }
                    });
                }
                var uploadingAlert = AlertService.addWarningMessage(gettextCatalog.getString('Uploading attachments...'));
                var parentPromise = $q.all(promises);
                parentPromise.then(angular.bind(this, function () {
                    this.originalAttachments = this.originalAttachments.concat(this.updatedAttachments);
                    this.updatedAttachments = [];
                    AlertService.removeAlert(uploadingAlert);
                }), function (error) {
                    AlertService.addStrataErrorMessage(error);
                    AlertService.removeAlert(uploadingAlert);
                });
                return parentPromise;
            }
        };
        this.parseArtifactHtml = function () {
            var parsedHtml = '';
            if (RHAUtils.isNotEmpty(this.suggestedArtifact.description)) {
                var rawHtml = this.suggestedArtifact.description.toString();
                parsedHtml = $sce.trustAsHtml(rawHtml);
            }
            return parsedHtml;
        };
        this.fetchMaxAttachmentSize = function () {
            strataService.values.cases.attachment.size().then(angular.bind(this, function (response) {
                if (RHAUtils.isNotEmpty(response)) {
                    this.maxAttachmentSize = response.match(/\d+/)[0];
                }
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
]);
