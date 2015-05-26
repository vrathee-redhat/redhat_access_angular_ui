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
    function ($location, $q, AlertService, udsService, HeaderService,RHAUtils,securityService) {
        this.discussionElements =
            [
            ];
        this.loadingAttachments = false;
        this.loadingComments = false;
        this.commentTextBoxEnlargen = false;
        this.comments=[];
        this.getDiscussionElements = function(caseId){
            var attachPromise = null;
            var commentsPromise = null;
            this.discussionElements = [];
            this.loadingAttachments = true;
           /* attachPromise = populateAttachments(caseId).then(angular.bind(this, function (attachmentsJSON) {
                this.loadingAttachments= false;
            }), angular.bind(this, function (error) {
                if(!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
                this.loadingAttachments= false;
            }));*/
            var promise = udsService.kase.comments.get(caseId); //hardcoding case number...replace it with caseNumbe
            var draftId;
            promise.then(angular.bind(this, function (comments) {
                angular.forEach(comments, angular.bind(this, function (comment, index) {

                    if (comment.draft === true) {
                        this.draftComment = comment;
                        this.draftCommentOnServerExists=true;
                        draftId=this.draftComment.id;
                        this.commentText = comment.text;
                        this.isCommentPublic = comment.public;
                        if (RHAUtils.isNotEmpty(this.commentText)) {
                            this.disableAddComment = false;
                        } else if (RHAUtils.isEmpty(this.commentText)) {
                            this.disableAddComment = true;
                        }
                        comments.slice(index, index + 1);
                    }
                }));
                if(this.localStorageCache) {
                    if (this.localStorageCache.get(caseNumber+securityService.loginStatus.authedUser.sso_username))
                    {
                        this.draftComment = this.localStorageCache.get(caseNumber+securityService.loginStatus.authedUser.sso_username);
                        this.commentText = this.draftComment.text;
                        this.isCommentPublic = this.draftComment.public;
                        if(this.draftCommentOnServerExists)
                        {
                            this.draftComment.id=draftId;
                        }
                        if (RHAUtils.isNotEmpty(this.commentText)) {
                            this.disableAddComment = false;
                        } else if (RHAUtils.isEmpty(this.commentText)) {
                            this.disableAddComment = true;
                        }
                    }
                }
                this.discussionElements =comments;

            }), function (error) {
            }).then(function (comments) {
              //  this.discussionElements=comments;
            }, function (error) {
                if(!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });

            return $q.all([attachPromise, commentsPromise]);
        };



        this.populateAttachments = function (caseNumber) {
          /*  var promise = udsService.kase.attachments.get(caseNumber);
            var draftId;
            promise.then(angular.bind(this, function (attachments) {
                angular.forEach(attachments, angular.bind(this, function (attachment, index) {
                }));

                this.comments = comments;
            }), function (error) {
            });
            return promise;*/
        };
    }
]);

