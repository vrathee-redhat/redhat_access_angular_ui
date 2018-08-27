'use strict';

import hydrajs from '../../shared/hydrajs';

export default class DiscussionService {
    constructor($location, $q, AlertService, RHAUtils, AttachmentsService, CaseService, strataService, HeaderService, securityService, COMMON_CONFIG) {
        'ngInject';

        this.discussionElements = [];
        this.chatTranscriptList = [];
        this.comments = CaseService.comments;
        this.attachments = AttachmentsService.originalAttachments;
        this.externalUpdates = CaseService.externalUpdates;
        this.loadingAttachments = false;
        this.loadingComments = false;
        this.commentTextBoxEnlargen = false;

        this.getAttachments = (caseId) => {
            if (!this.loadingAttachments) {
                this.loadingAttachments = !this.loadingAttachments;
            }

            return strataService.cases.attachments.list(caseId).then(angular.bind(this, function (attachmentsStrata) {
                return hydrajs.kase.attachments.getAttachmentsS3(caseId).then(angular.bind(this, (attachmentsS3) => {
                    attachmentsS3.concat(attachmentsStrata);
                    attachmentsS3.forEach((val, index) => {
                        const item = attachmentsS3[index];
                        const lastModifiedDate = RHAUtils.convertToTimezone(item.lastModifiedDate);
                        item.file_name = item.fileName;
                        item.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                        item.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                        item.published_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                        item.published_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                    });

                    AttachmentsService.defineOriginalAttachments(attachmentsS3);
                    this.updateElements();
                    this.loadingAttachments = false;
                }));
            }), angular.bind(this, function (error) {
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
                this.loadingAttachments = false;
            }));
        };

        this.getDiscussionElements = function (caseId) {
            var attachPromise = null;
            var commentsPromise = null;
            var externalUpdatesPromise = null;
            this.discussionElements = [];
            this.loadingAttachments = true;
            if(!COMMON_CONFIG.isGS4) {
                attachPromise = this.getAttachments(caseId);
            }
            commentsPromise = CaseService.populateComments(caseId).then(function () {
            }, function (error) {
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });
            externalUpdatesPromise = CaseService.populateExternalUpdates(caseId).then(function () {
            }, function (error) {
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });
            //TODO should this be done in case service???
            this.loadingComments = true;
            if(COMMON_CONFIG.isGS4) {
                return $q.all([commentsPromise, externalUpdatesPromise]);
            }
            return $q.all([attachPromise, commentsPromise, externalUpdatesPromise]);

        };
        this.updateElements = function () {
            this.comments = CaseService.comments;
            this.attachments = AttachmentsService.originalAttachments;
            this.externalUpdates = CaseService.externalUpdates;
            this.discussionElements = this.comments.concat(this.attachments);
            this.discussionElements = this.discussionElements.concat(this.externalUpdates);
            if (this.chatTranscriptList !== undefined && this.chatTranscriptList.length > 0) {
                this.discussionElements = this.discussionElements.concat(this.chatTranscriptList);
            }
        };
    }
}
