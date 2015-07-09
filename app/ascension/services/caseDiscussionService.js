'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDiscussionService', [
    '$q',
    'AlertService',
    'HeaderService',
    'CaseDetailsService',
    'CaseAttachmentsService',
    'RHAUtils',
    function ( $q, AlertService, HeaderService,CaseDetailsService,CaseAttachmentsService,RHAUtils) {
        this.discussionElements = [];
        this.chatTranscriptList = [];
        this.privateComments = CaseDetailsService.privateComments;
        this.publicComments = CaseDetailsService.publicComments;
        this.bugzillas = CaseDetailsService.bugzillas;
        this.liveChatTranscripts=CaseDetailsService.kase.liveChatTranscripts;
        this.attachments = CaseAttachmentsService.originalAttachments;
        this.loadingComments = false;
        this.commentTextBoxEnlargen = false;
        this.getDiscussionElements = function (caseId) {
            var commentsPromise = null;
            this.discussionElements = [];
            this.loadingComments = true;
            CaseAttachmentsService.defineOriginalAttachments(CaseDetailsService.kase.attachments);
            commentsPromise = CaseDetailsService.populateComments(caseId).then( angular.bind(this, function (comments){
                this.updateElements();
                this.loadingComments = false;
            }), angular.bind(this, function (error) {
                this.loadingComments = false;
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addUDSErrorMessage(error);
                }
            }));
            if (RHAUtils.isNotEmpty(CaseDetailsService.kase.liveChatTranscripts)) {
                this.liveChatTranscripts=CaseDetailsService.kase.liveChatTranscripts;
            }
            return $q.all([commentsPromise]);
        };
        this.updateElements = function () {
            this.privateComments = CaseDetailsService.privateComments;
            this.discussionElements = this.discussionElements.concat(this.privateComments);
            this.publicComments = CaseDetailsService.publicComments;
            this.discussionElements = this.discussionElements.concat(this.publicComments);
            this.bugzillas = CaseDetailsService.bugzillas;
            this.discussionElements = this.discussionElements.concat(this.bugzillas);
            this.attachments = CaseAttachmentsService.originalAttachments;
            this.discussionElements = this.discussionElements.concat(this.attachments);
            if(RHAUtils.isNotEmpty(this.liveChatTranscripts) )
            {
                this.discussionElements =this.discussionElements.concat(this.liveChatTranscripts)
            }
        };
    }
]);

