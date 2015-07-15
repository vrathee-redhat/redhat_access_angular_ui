'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDiscussionService', [
    '$q',
    'AlertService',
    'HeaderService',
    'CaseDetailsService',
    'CaseAttachmentsService',
    'RHAUtils',
    'udsService',
    '$modal',
    function ( $q, AlertService, HeaderService,CaseDetailsService,CaseAttachmentsService,RHAUtils,udsService,$modal) {
        this.discussionElements = [];
        this.privateComments = CaseDetailsService.privateComments;
        this.publicComments = CaseDetailsService.publicComments;
        this.bugzillas = CaseDetailsService.bugzillas;
        this.liveChatTranscripts=CaseDetailsService.liveChatTranscripts;
        this.bomgarSessions=CaseDetailsService.bomgarSessions;
        this.attachments = CaseAttachmentsService.originalAttachments;
        this.bomgarSessionKey=undefined;
        this.bomgarKeyUrl=undefined;
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
            if (RHAUtils.isNotEmpty(CaseDetailsService.liveChatTranscripts)) {
                this.liveChatTranscripts=CaseDetailsService.liveChatTranscripts;
            }
            if (RHAUtils.isNotEmpty(CaseDetailsService.bomgarSessions)) {

                this.bomgarSessions=CaseDetailsService.bomgarSessions;
            }
            return $q.all([commentsPromise]);
        };

        this.updateElements = function () {
            this.discussionElements =new Array();
            this.privateComments = CaseDetailsService.privateComments;
            this.discussionElements = this.discussionElements.concat(this.privateComments);
            this.publicComments = CaseDetailsService.publicComments;
            this.discussionElements = this.discussionElements.concat(this.publicComments);
            this.bugzillas = CaseDetailsService.bugzillas;
            this.discussionElements = this.discussionElements.concat(this.bugzillas);
            CaseAttachmentsService.defineOriginalAttachments(CaseDetailsService.kase.attachments);
            this.attachments = CaseAttachmentsService.originalAttachments;
            this.discussionElements = this.discussionElements.concat(this.attachments);
            this.liveChatTranscripts=CaseDetailsService.liveChatTranscripts;
            this.discussionElements =this.discussionElements.concat(this.liveChatTranscripts);
            this.bomgarSessions=CaseDetailsService.bomgarSessions;
            this.discussionElements =this.discussionElements.concat(this.bomgarSessions);
        };

        this.initiateBomgar=function(caseId)
        {
            udsService.bomgar.getSessionKey(caseId).then(angular.bind(this, function (response) {
                this.bomgarKeyUrl=response.resource.keyUrl;
                this.bomgarSessionKey=response.resource.sessionKey;
                $modal.open({
                    templateUrl: 'ascension/views/bomgarSessionDetails.html',
                    controller: 'BomgarSessionDetails'
                });

            }), function (error) {
                AlertService.addUDSErrorMessage(error);
            });
        };
    }
]);

