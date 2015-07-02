'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDiscussionService', [
    '$location',
    '$q',
    'AlertService',
    'udsService',
    'HeaderService',
    'RHAUtils',
    'securityService',
    'CaseDetailsService',
    'CaseAttachmentsService',
    'strataService',
    function ($location, $q, AlertService, udsService, HeaderService,RHAUtils,securityService,CaseDetailsService,CaseAttachmentsService,strataService) {
        this.discussionElements = [];
        this.chatTranscriptList = [];
        this.comments = CaseDetailsService.comments;
        this.attachments = CaseAttachmentsService.originalAttachments;
        this.loadingAttachments = false;
        this.loadingComments = false;
        this.commentTextBoxEnlargen = false;
        this.getDiscussionElements = function (caseId) {
            var attachPromise = null;
            var commentsPromise = null;
            this.discussionElements = [];
            this.loadingAttachments = true;
            this.loadingComments = true;
            var that=this;

            CaseAttachmentsService.defineOriginalAttachments(CaseDetailsService.kase.attachments);
            this.updateElements();
            commentsPromise = CaseDetailsService.populateComments(caseId).then(function (comments) {
                that.loadingComments = false;
                that.updateElements();
            }, function (error) {
                that.loadingComments = false;
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });


            return $q.all([commentsPromise]);
        };
        this.updateElements = function () {
            this.comments = CaseDetailsService.comments;
            this.attachments = CaseAttachmentsService.originalAttachments;
            this.discussionElements = this.comments.concat(this.attachments);
            /*if (this.chatTranscriptList !== undefined && this.chatTranscriptList.length > 0) {
                this.discussionElements = this.discussionElements.concat(this.chatTranscriptList);
            }*/
        };
    }
]);

