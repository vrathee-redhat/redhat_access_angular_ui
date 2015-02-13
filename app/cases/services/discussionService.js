'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('DiscussionService', [
    'AlertService',
    'AttachmentsService',
    'CaseService',
    'strataService',
    function (AlertService, AttachmentsService, CaseService, strataService) {
        this.discussionElements = [];
        this.comments = CaseService.comments
        this.attachments = AttachmentsService.originalAttachments;
        this.loadingAttachments = false;
        this.loadingComments = false;
        this.getDiscussionElements = function(caseId){
            this.discussionElements = [];
            //if (EDIT_CASE_CONFIG.showAttachments) {
            this.loadingAttachments = true;
            strataService.cases.attachments.list(caseId).then(angular.bind(this, function (attachmentsJSON) {
                AttachmentsService.defineOriginalAttachments(attachmentsJSON);
                //this.attachments = AttachmentsService.originalAttachments;
                //this.discussionElements = this.discussionElements.concat(this.attachments);
                this.loadingAttachments= false;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
                this.loadingAttachments= false;
            }));
            CaseService.populateComments(caseId);
            //}
            //if (EDIT_CASE_CONFIG.showComments) {
            //TODO should this be done in case service???
            this.loadingComments = true;
            // strataService.cases.comments.get(caseId).then(angular.bind(this, function (commentsJSON) {
            //     this.comments = commentsJSON;
            //     this.discussionElements = this.discussionElements.concat(this.comments);
            //     this.loadingComments = false;
            // }), function (error) {
            //     AlertService.addStrataErrorMessage(error);
            //     this.loadingComments = false;
            // });
            //}
        };
        this.updateElements = function(){
            this.comments = CaseService.comments
            this.attachments = AttachmentsService.originalAttachments;
            this.discussionElements = this.comments.concat(this.attachments);
        }
    }
]);