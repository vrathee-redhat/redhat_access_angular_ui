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
            attachPromise = strataService.cases.attachments.list(caseId).then(angular.bind(this, function (attachmentsJSON) {
                console.log("inside attachments");
                CaseAttachmentsService.defineOriginalAttachments(attachmentsJSON);
                that.loadingAttachments = false;
                that.updateElements();
            }), angular.bind(this, function (error) {
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }

                that.loadingAttachments = false;
            }));
            commentsPromise = CaseDetailsService.populateComments(caseId).then(function (comments) {
                that.loadingComments = false;
                that.updateElements();
            }, function (error) {
                that.loadingComments = false;
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });


            return $q.all([attachPromise, commentsPromise]);
        };
        this.updateElements = function () {
            console.log("inside update elements");
            this.comments = CaseDetailsService.comments;
            this.attachments = CaseAttachmentsService.originalAttachments;
            this.discussionElements = this.comments.concat(this.attachments);
            if (this.chatTranscriptList !== undefined && this.chatTranscriptList.length > 0) {
                this.discussionElements = this.discussionElements.concat(this.chatTranscriptList);
            }
        };
    }
]);

