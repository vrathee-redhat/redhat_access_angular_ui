'use strict';

import _ from 'lodash';
import hydrajs from '../../shared/hydrajs';

export default class AttachmentsService {
    constructor($q, $sce, $state, $window, $location, $rootScope, $timeout, RHAUtils, strataService, HeaderService, TreeViewSelectorUtils, $http, securityService, AlertService, CaseService, gettextCatalog, AUTH_EVENTS) {
        'ngInject';

        this.originalAttachments = [];
        this.updatedAttachments = [];
        this.backendAttachments = [];
        this.suggestedArtifact = {};
        this.proceedWithoutAttachments = false;
        this.loading = false;
        this.maxAttachmentSize;

        this.init = async function() {
            try {
                this.s3AccountConfigurations = await hydrajs.kase.attachments.getS3UploadAccounts();
            } catch (error) {
                this.s3AccountConfigurations = {
                    s3UploadFunctionality: 'specified_accounts',
                    result: []
                };
            }
        };

        this.accountCanAddAttachments = () => _.get(securityService, 'loginStatus.authedUser.can_add_attachments', false);

        this.isValidS3UploadAccount = function () {
            const accountNumber = CaseService.account.number;
            const uploadFunctionality = this.s3AccountConfigurations.s3UploadFunctionality;
            if (uploadFunctionality === 'enable_all' ||
                (uploadFunctionality === 'specified_accounts' &&
                    _.find(this.s3AccountConfigurations.result, (o) => o === accountNumber))) {
                return true;
            }

            return false;
        };

        // returns true if the attachment is
        this.isAwsAttachment = (attachment) => attachment && attachment.link &&
            (attachment.link.indexOf('/hydra/rest/') > -1 || attachment.link.indexOf('/hydrafs/rest/') > -1);

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

                return response;
            });

            const strataS3 = _.uniqBy(attachmentsS3.concat(attachmentsStrata), 'uuid');
            const attachments = _.map(strataS3, (item) => {
                const lastModifiedDate = RHAUtils.convertToTimezone(item.lastModifiedDate);
                item.file_name = item.fileName || item.filename;
                item.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                item.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                item.sortModifiedDate = new Date(item.lastModifiedDate);
                item.published_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                item.published_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');

                return item;
            });

            this.defineOriginalAttachments(attachments);
            this.loading = false;
        };

        this.updateAttachments = async function(caseId) {
            try {
                return this.isValidS3UploadAccount() ? this.updateAttachmentsS3(caseId) : this.updateAttachmentsStrata(caseId);
            } catch (error) {
                AlertService.addWarningMessage(error);
            }
        };

        this.updateAttachmentsStrata = function (caseId) {
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
                    _.each(updatedAttachments, (attachment) => {
                        if (!attachment.hasOwnProperty('uuid')) {
                            var formdata = new FormData();
                            formdata.append('file', attachment.fileObj);
                            formdata.append('description', attachment.description);

                            const updateProgress = (progress) => {
                                attachment.progress = Math.round(progress);
                                if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
                                    $rootScope.$apply();
                                }
                            };

                            var promise = strataService.cases.attachments.post(formdata, caseId, updateProgress);
                            promise.then((uri) => {
                                attachment.progress = null;
                                attachment.uri = uri;
                                attachment.uuid = uri.slice(uri.lastIndexOf('/') + 1);
                                var currentDate = new Date();
                                var lastModifiedDate = RHAUtils.convertToTimezone(currentDate);
                                attachment.sortModifiedDate = currentDate;
                                attachment.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                                attachment.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                                attachment.published_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                                attachment.published_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                                AlertService.addSuccessMessage(gettextCatalog.getString('Successfully uploaded attachment {{attachmentFileName}} to case {{caseNumber}}', {
                                    attachmentFileName: attachment.file_name,
                                    caseNumber: caseId
                                }));
                            }, function (error) {
                                if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
                                    if ($location.path() === '/case/new') {
                                        $state.go('edit', {id: caseId});
                                        AlertService.clearAlerts();
                                        CaseService.submittingCase = false;
                                    } else {
                                        $window.location.reload();
                                    }
                                } else {
                                    AlertService.addStrataErrorMessage(error);
                                }
                            });
                            promises.push(promise);
                        }
                    });
                }
                var uploadingAlert = AlertService.addWarningMessage(gettextCatalog.getString('Uploading attachments...'));
                var parentPromise = $q.all(promises);
                parentPromise.then(angular.bind(this, function () {
                    this.updatedAttachments = [];
                    AlertService.removeAlert(uploadingAlert);
                }), function (error) {
                    AlertService.addStrataErrorMessage(error);
                    AlertService.removeAlert(uploadingAlert);
                });
                return parentPromise;
            }
        };

        this.abortS3Upload = function (attachment) {
            attachment.aborted = true;
            hydrajs.kase.attachments.abortS3Upload(attachment.uuid);
        };

        this.updateAttachmentsS3 = async function (caseId) {
            const hasServerAttachments = this.hasBackEndSelections();
            const hasLocalAttachments = this.updatedAttachments && this.updatedAttachments.length > 0;
            const uploadAlert = AlertService.addWarningMessage(gettextCatalog.getString('Uploading attachments...'));

            if (hasLocalAttachments || hasServerAttachments) {
                var promises = [];
                var updatedAttachments = this.updatedAttachments;
                if (hasServerAttachments) {
                    promises.push(this.postBackEndAttachments(caseId));
                }
                if (hasLocalAttachments) {
                    //find new attachments
                    try {
                        await Promise.all(_.map(updatedAttachments, async (attachment) => {
                            if (!attachment.hasOwnProperty('uuid')) {
                                const putObjectRequest = {
                                    Body: attachment.fileObj,
                                    ContentLength: attachment.fileObj.size,
                                    Metadata: {
                                        'x-amz-meta-description': attachment.description,
                                        'x-amz-meta-fileName': attachment.fileObj.name,
                                        'x-amz-meta-byteLength': attachment.fileObj.size.toString(),
                                        'x-amz-meta-content-type': attachment.fileObj.type
                                    }
                                };

                                const s3UploadCredentialsData = {
                                    fileName: attachment.fileObj.name,
                                    size: attachment.fileObj.size,
                                    isPrivate: !CaseService.isCommentPublic,
                                    description: attachment.description
                                };

                                const listener = (progress) => {
                                    const decimal = progress.loaded / progress.total;
                                    const percent = decimal * 100;
                                    attachment.progress = Math.floor(percent);

                                    if (decimal === 1) {
                                        attachment.verifyingUpload = true;
                                    }

                                    if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
                                        $rootScope.$apply();
                                    }
                                };

                                try {
                                    const res = await hydrajs.kase.attachments.uploadAttachmentS3(
                                        caseId,
                                        s3UploadCredentialsData,
                                        putObjectRequest,
                                        listener
                                    );

                                    attachment.uuid = res.attachmentId;
                                    await res.promise;

                                    if (!attachment.aborted) {
                                        AlertService.addSuccessMessage(gettextCatalog.getString('Successfully uploaded attachment {{filename}} to case {{id}}', {
                                            filename: attachment.fileObj.name,
                                            id: caseId
                                        }));
                                    }
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
                                        AlertService.addDangerMessage(gettextCatalog.getString('Could not upload {{filename}}', {
                                            filename: attachment.fileObj.name
                                        }));
                                    }

                                    throw error;
                                }
                            }
                        }));

                        const updatedLen = this.originalAttachments.length + this.updatedAttachments.length;
                        do {
                            try {
                                await this.getAttachments(caseId);
                            } catch (error) {
                                AlertService.addDangerMessage(gettextCatalog.getString('Could not fetch attachments: {{message}}', {
                                    message: error.message
                                }));
                            }
                        } while (this.originalAttachments.length !== updatedLen);

                        this.updatedAttachments = [];
                        AlertService.removeAlert(uploadAlert);
                    } catch (error) {
                        AlertService.removeAlert(uploadAlert);
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

        if (securityService.loginStatus.isLoggedIn) {
            this.init();
        }

        $rootScope.$on(AUTH_EVENTS.loginSuccess, angular.bind(this, function () {
            this.init();
        }));
    }
}
