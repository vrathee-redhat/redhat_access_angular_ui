'use strict';

import _ from 'lodash';
import hydrajs from '../../shared/hydrajs';

export default class AttachmentsService {
    constructor($q, $sce, $state, $window, $location, $rootScope, $timeout, RHAUtils, strataService, HeaderService, TreeViewSelectorUtils, $http, securityService, AlertService, CaseService, gettextCatalog, ATTACHMENTS) {
        'ngInject';

        this.originalAttachments = [];
        this.updatedAttachments = [];
        this.backendAttachments = [];
        this.suggestedArtifact = {};
        this.proceedWithoutAttachments = false;
        this.loading = false;
        this.maxAttachmentSize;

        // Key/val for an attachment uuid to credentials
        this.attachmentCredentials = {};

        // returns true if the attachment is
        this.isAwsAttachment = (attachment) => attachment &&
            attachment.uri &&
            !attachment.uri.indexOf('/hydrafs/rest/') &&
            !attachment.uri.indexOf('/hydra/rest/');

        this.clear = function () {
            this.originalAttachments = [];
            this.updatedAttachments = [];
            this.backendAttachments = [];
            this.suggestedArtifact = {};
        };
        this.updateBackEndAttachments = function (selected) {
            this.backendAttachments = selected;
        };
        this.hasBackEndSelections = function () {
            return TreeViewSelectorUtils.hasSelections(this.backendAttachments);
        };
        this.removeUpdatedAttachment = function ($index) {
            this.updatedAttachments.splice($index, 1);
        };

        this.removeOriginalAttachment = function (attachment) {
            var progressMessage = AlertService.addWarningMessage(gettextCatalog.getString('Deleting attachment: {{attachmentName}}', {attachmentName: attachment.file_name}));

            // cannot delete files uploaded to s3 yet.
            if (this.isAwsAttachment(attachment)) {
                strataService.cases.attachments.remove(attachment.uuid, CaseService.kase.case_number).then(angular.bind(this, function () {
                    AlertService.removeAlert(progressMessage);
                    AlertService.addSuccessMessage(gettextCatalog.getString('Successfully deleted attachment:{{attachmentName}}', {attachmentName: attachment.file_name}));
                    var i = 0;
                    for (i; i < this.originalAttachments.length; i++) {
                        if (this.originalAttachments[i].uuid === attachment.uuid) {
                            break;
                        }
                    }
                    this.originalAttachments.splice(i, 1);
                }), function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }

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
        this.postBackEndAttachments = function (caseId) {
            var selectedFiles = TreeViewSelectorUtils.getSelectedLeaves(this.backendAttachments);
            return securityService.getBasicAuthToken().then(function (auth) {
                /*jshint unused:false */
                //we post each attachment separately
                var promises = [];
                angular.forEach(selectedFiles, function (file) {
                    var jsonData = {
                        authToken: auth,
                        attachment: file,
                        caseNum: caseId
                    };
                    var deferred = $q.defer();
                    $http.post('attachments', jsonData).success(function (data, status, headers, config) {
                        deferred.resolve(data);
                        AlertService.clearAlerts();
                        AlertService.addSuccessMessage(gettextCatalog.getString('Successfully uploaded attachment {{attachmentName}} to case {{caseNumber}}',{attachmentName:jsonData.attachment,caseNumber:caseId}));
                    }).error(function (data, status, headers, config) {
                        var errorMsg = '';
                        switch (status) {
                            case 401:
                                errorMsg = ' : Unauthorised.';
                                break;
                            case 409:
                                errorMsg = ' : Invalid username/password.';
                                break;
                            case 500:
                                errorMsg = ' : Internal server error';
                                break;
                        }
                        AlertService.addDangerMessage(gettextCatalog.getString('Failed to upload attachment {{attachmentName}} to case {{caseNumber}}: {{errorMessage}}',{attachmentName:jsonData.attachment,caseNumber:caseId,errorMessage:errorMsg}));
                        deferred.reject(data);
                    });
                    promises.push(deferred.promise);
                });
                return $q.all(promises);
            });
        };

        this.getAttachments = async function(caseId) {
            const responses = await Promise.all([
                strataService.cases.attachments.list(caseId),
                hydrajs.kase.attachments.getAttachmentsS3(caseId)
            ]);

            const attachmentsS3 = responses[1];
            const attachmentsStrata = _.map(responses[0], (response) => {
                response.caseNumber = caseId;
                response.createdBy = response.created_by;
                response.fileType = response.mime_type;
                response.fileName = response.file_name;
                response.isPrivate = response.private;
                response.size = response.length;
                response.link = response.uri;

                return response;
            });

            const strataS3 = _.uniqBy(attachmentsS3.concat(attachmentsStrata), 'uuid');
            const attachments = _.map(strataS3, (item) => {
                const lastModifiedDate = RHAUtils.convertToTimezone(item.lastModifiedDate);

                item.file_name = item.fileName || item.filename;
                item.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                item.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                item.published_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                item.published_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');

                return item;
            });

            this.defineOriginalAttachments(attachments);
            this.loading = false;

            return attachments;
        }

        this.updateAttachments = async function (caseId) {
            const hasServerAttachments = this.hasBackEndSelections();
            const hasLocalAttachments = this.updatedAttachments && this.updatedAttachments.length > 0;
            if (hasLocalAttachments || hasServerAttachments) {
                var promises = [];
                var updatedAttachments = this.updatedAttachments;
                if (hasServerAttachments) {
                    promises.push(this.postBackEndAttachments(caseId));
                }
                if (hasLocalAttachments) {
                    //find new attachments
                    try {
                        const attachmentPromises = await Promise.all(_.map(updatedAttachments, async (attachment) => {
                            const uploadAlert = AlertService.addWarningMessage(gettextCatalog.getString('Uploading attachments...'));
                            if (!attachment.hasOwnProperty('uuid')) {
                                const putObjectRequest = {
                                    Body: attachment.fileObj,
                                    ContentLength: attachment.fileObj.size,
                                    Metadata: {
                                        description: attachment.description,
                                        fileName: attachment.fileObj.name,
                                        byteLength: attachment.fileObj.size.toString()
                                    }
                                };

                                const s3UploadCredentialsData = {
                                    fileName: attachment.fileObj.name,
                                    size: attachment.fileObj.size,
                                    isPrivate: !CaseService.isCommentPublic,
                                    description: attachment.description
                                };

                                const attachmentUploadStatus = async (caseNumber, uuid) => {
                                    const res = await hydrajs.kase.attachments.checkUploadStatusS3(caseNumber, uuid);

                                    if (res.status === ATTACHMENTS.METADATA_CREATION_PENDING) {
                                        // Polls the status of the file upload status and refreshes credentials when necessary.
                                        $timeout(async () => {
                                            if (this.attachmentCredentials[res.attachmentId] - 30000 < Date.now()) {
                                                await hydrajs.kase.attachments.refreshUploadCredentials(res.caseNumber, res.attachmentId)
                                                await attachmentUploadStatus(res.caseNumber, res.attachmentId);
                                            } else {
                                                await attachmentUploadStatus(res.caseNumber, res.attachmentId);
                                            }
                                        }, 10000);
                                    } else if (res.status === ATTACHMENTS.METADATA_CREATION_FAILED) {
                                        delete this.attachmentCredentials[res.attachmentId];

                                        AlertService.addDangerMessage(gettextCatalog.getString('Error: Failed to upload attachment {{filename}} to case {{caseId}}', {
                                            filename: attachment.fileObj.name,
                                            caseId: res.caseNumber
                                        }));
                                    } else if (res.status === ATTACHMENTS.METADATA_CREATION_COMPLETED) {
                                        delete this.attachmentCredentials[res.attachmentId];

                                        AlertService.addSuccessMessage(gettextCatalog.getString('Attachment {{filename}} to case {{caseId}} uploaded successfully', {
                                            caseId: res.caseNumber,
                                            filename: attachment.fileObj.name
                                        }));
                                    }

                                    if (RHAUtils.isObjectEmpty(this.attachmentCredentials)) {
                                        AlertService.removeAlert(uploadAlert);

                                        try {
                                            await this.getAttachments(res.caseNumber);
                                        } catch (error) {
                                            AlertService.addDangerMessage(error);
                                        }
                                    }
                                };

                                try {
                                    const res = await hydrajs.kase.attachments.uploadAttachmentS3(caseId, s3UploadCredentialsData, putObjectRequest);
                                    this.attachmentCredentials[res.attachmentId] = res.credentials;
                                    await attachmentUploadStatus(res.caseNumber, res.attachmentId);
                                } catch (error) {
                                    if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
                                        if ($location.path() === '/case/new') {
                                            $state.go('edit', {id: caseId});
                                            AlertService.clearAlerts();
                                            CaseService.submittingCase = false;
                                        } else {
                                            $window.location.reload();
                                        }
                                    } else {
                                        AlertService.addDangerMessage(error);
                                    }
                                }
                            }
                        }));

                        this.updatedAttachments = [];
                        return attachmentPromises;
                    } catch (error) {
                        AlertService.addStrataErrorMessage(error);
                    }
                }
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
}
