'use strict';
/*global $, draftComment*/
/*jshint camelcase: false, expr: true*/
angular.module('RedhatAccess.ascension').controller('AddComments', [
    '$scope',
    'strataService',
    'CaseDetailsService',
    'AlertService',
    'CaseAttachmentsService',
    'CaseDiscussionService',
    'securityService',
    '$timeout',
    'RHAUtils',
    'EDIT_CASE_CONFIG',
    'udsService',
    function ($scope, strataService, CaseDetailsService, AlertService,CaseAttachmentsService,CaseDiscussionService, securityService, $timeout, RHAUtils, EDIT_CASE_CONFIG, udsService) {
        $scope.CaseDetailsService = CaseDetailsService;
        $scope.securityService = securityService;
        $scope.CaseAttachmentsService = CaseAttachmentsService;
        $scope.CaseDiscussionService = CaseDiscussionService;
        $scope.addingComment = false;
        $scope.addingattachment = false;
        $scope.progressCount = 0;
        $scope.charactersLeft = 0;
        $scope.maxCommentLength = '32000';

        CaseDiscussionService.commentTextBoxEnlargen = false;

        $scope.clearComment = function(){
            CaseDetailsService.commentText = undefined;
            CaseDiscussionService.commentTextBoxEnlargen = false;
        	CaseAttachmentsService.updatedAttachments = [];
        };

        $scope.addComment = function () {

            if (!securityService.loginStatus.authedUser.is_internal) {
                CaseDetailsService.isCommentPublic = true;
            }
            var onSuccess = function (response) {
                CaseDetailsService.isCommentPublic = false;
                CaseDetailsService.draftCommentOnServerExists=false;
                if(CaseDetailsService.localStorageCache)
                {
                    CaseDetailsService.localStorageCache.remove(CaseDetailsService.kase.case_number+securityService.loginStatus.authedUser.sso_username);
                }
                if (RHAUtils.isNotEmpty($scope.saveDraftPromise)) {
                    $timeout.cancel($scope.saveDraftPromise);
                }
                CaseDetailsService.commentText = '';
                CaseDetailsService.disableAddComment = true;
                CaseDetailsService.checkForCaseStatusToggleOnAttachOrComment();

                CaseDetailsService.populateComments(CaseDetailsService.kase.case_number).then(function (comments) {
                    $scope.addingComment = false;
                    $scope.savingDraft = false;
                    CaseDetailsService.draftSaved = false;
                    CaseDetailsService.draftComment = undefined;
                    CaseDiscussionService.commentTextBoxEnlargen = false;
                    CaseDiscussionService.updateElements();
                }, function (error) {
                    $scope.addingComment = false;
                    AlertService.addStrataErrorMessage(error);
                });


                $scope.progressCount = 0;
                $scope.charactersLeft = 0;

                //temporarily use strata for notification
                if(securityService.loginStatus.authedUser.sso_username !== undefined && CaseDetailsService.updatedNotifiedUsers.indexOf(securityService.loginStatus.authedUser.sso_username) === -1){
                    strataService.cases.notified_users.add(CaseDetailsService.getEightDigitCaseNumber(CaseDetailsService.kase.case_number), securityService.loginStatus.authedUser.sso_username).then(function () {
                        CaseDetailsService.updatedNotifiedUsers.push(securityService.loginStatus.authedUser.sso_username);
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                }

            };
            var onError = function (error) {
                AlertService.addStrataErrorMessage(error);
                $scope.addingComment = false;
                $scope.progressCount = 0;
                $scope.charactersLeft = 0;
            };

            $scope.addingComment = false;
            if(!CaseDetailsService.disableAddComment && RHAUtils.isNotEmpty(CaseDetailsService.commentText)) {
                $scope.addingComment = true;
                if (CaseDetailsService.isCommentPublic) {
                    udsService.kase.comments.post.public(CaseDetailsService.kase.case_number, CaseDetailsService.commentText).then(onSuccess, onError);
                }
                else {
                    udsService.kase.comments.post.private(CaseDetailsService.kase.case_number, CaseDetailsService.commentText).then(onSuccess, onError);
                }
            }

            $scope.addingattachment = false;
            if ((CaseAttachmentsService.updatedAttachments.length > 0) && EDIT_CASE_CONFIG.showAttachments) {
                $scope.addingattachment = true;
                var  caseNumber =CaseDetailsService.getEightDigitCaseNumber(CaseDetailsService.kase.case_number);
                CaseAttachmentsService.updateAttachments(caseNumber).then(function () {
                    $scope.addingattachment = false;
                    CaseDetailsService.checkForCaseStatusToggleOnAttachOrComment();
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                    $scope.addingattachment = false;
                });
            }
        };
        $scope.saveDraftPromise;
        $scope.onNewCommentKeypress = function () {
            CaseDetailsService.disableAddComment = false;
            if (RHAUtils.isEmpty(CaseDetailsService.commentText)) {
                CaseDetailsService.disableAddComment = true;
            }
        };

        $scope.onCommentPublicChange = function () {
            if(RHAUtils.isNotEmpty(CaseDetailsService.commentText))
            {
                $scope.onNewCommentKeypress();
            }

        };
        $scope.$watch('CaseDetailsService.commentText', function() {
            $scope.maxCharacterCheck();
        });
        $scope.maxCharacterCheck = function() {
            if (CaseDetailsService.commentText !== undefined && $scope.maxCommentLength  >= CaseDetailsService.commentText.length) {
                var count = CaseDetailsService.commentText.length * 100 / $scope.maxCommentLength ;
                parseInt(count);
                $scope.progressCount = Math.round(count * 100) / 100;
                var breakMatches = CaseDetailsService.commentText.match(/(\r\n|\n|\r)/g);
                var numberOfLineBreaks = 0;
                if(breakMatches){
                    numberOfLineBreaks = breakMatches.length;
                }
                $scope.charactersLeft = $scope.maxCommentLength - CaseDetailsService.commentText.length - numberOfLineBreaks;
                if($scope.charactersLeft < 0){
                    $scope.charactersLeft = 0;
                }
            }
            else if(CaseDetailsService.commentText===undefined)
            {
                $scope.progressCount=0;
                $scope.charactersLeft = 0;
            }
        };
        $scope.saveDraft = function () {
        };
        $scope.shouldTextboxMinimize = function(){
            if(CaseDetailsService.commentText === undefined || CaseDetailsService.commentText === ''){
                CaseDiscussionService.commentTextBoxEnlargen=false;
            }
        };

    }

]);
