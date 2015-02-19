'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('DiscussionService', [
    '$location',
    '$q',
    'AlertService',
    'AttachmentsService',
    'CaseService',
    'strataService',
    function ($location, $q, AlertService, AttachmentsService, CaseService, strataService) {
        this.discussionElements = [];
        this.comments = CaseService.comments
        this.attachments = AttachmentsService.originalAttachments;
        this.loadingAttachments = false;
        this.loadingComments = false;
        this.getDiscussionElements = function(caseId){
            var attachPromise = null;
            var commentsPromise = null;
            this.discussionElements = [];
            //if (EDIT_CASE_CONFIG.showAttachments) {
            this.loadingAttachments = true;
            attachPromise = strataService.cases.attachments.list(caseId).then(angular.bind(this, function (attachmentsJSON) {
                AttachmentsService.defineOriginalAttachments(attachmentsJSON);
                //this.attachments = AttachmentsService.originalAttachments;
                //this.discussionElements = this.discussionElements.concat(this.attachments);
                this.loadingAttachments= false;
            }), angular.bind(this, function (error) {
                AlertService.addStrataErrorMessage(error);
                this.loadingAttachments= false;
            }));
            commentsPromise = CaseService.populateComments(caseId)
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


            return $q.all([attachPromise, commentsPromise]);
        };
        this.updateElements = function(){
            this.comments = CaseService.comments
            this.attachments = AttachmentsService.originalAttachments;
            this.discussionElements = this.comments.concat(this.attachments);
        }
    }
]);