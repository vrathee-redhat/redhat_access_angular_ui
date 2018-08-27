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
        this.loadingComments = false;
        this.commentTextBoxEnlargen = false;

        this.getDiscussionElements = function (caseId) {
            var attachPromise = null;
            var commentsPromise = null;
            var externalUpdatesPromise = null;
            this.discussionElements = [];
            if(!COMMON_CONFIG.isGS4) {
                attachPromise = AttachmentsService.getAttachments(caseId)
                    .then(angular.bind(this, () => this.updateElements()));
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
