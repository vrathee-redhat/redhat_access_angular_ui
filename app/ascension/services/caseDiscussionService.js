'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDiscussionService', [
    '$q',
    'AlertService',
    'HeaderService',
    'CaseDetailsService',
    'CaseAttachmentsService',
    function ( $q, AlertService, HeaderService,CaseDetailsService,CaseAttachmentsService) {
        this.discussionElements = [];
        this.chatTranscriptList = [];
        this.comments = CaseDetailsService.comments;
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

            return $q.all([commentsPromise]);
        };
        this.updateElements = function () {
            this.comments = CaseDetailsService.comments;
            this.attachments = CaseAttachmentsService.originalAttachments;
            this.discussionElements = this.comments.concat(this.attachments);
        };
    }
]);

