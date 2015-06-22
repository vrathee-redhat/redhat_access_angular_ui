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
    'translate',
    function ($scope, strataService, CaseDetailsService, AlertService,CaseAttachmentsService,CaseDiscussionService, securityService, $timeout, RHAUtils, EDIT_CASE_CONFIG, translate) {
        $scope.CaseDetailsService = CaseDetailsService;
        $scope.securityService = securityService;
        $scope.CaseAttachmentsService = CaseAttachmentsService;
        $scope.CaseDiscussionService = CaseDiscussionService;
        $scope.addingComment = false;
        $scope.progressCount = 0;
        $scope.charactersLeft = 0;
        $scope.maxCommentLength = '32000';
        $scope.ieFileDescription = '';

        CaseDiscussionService.commentTextBoxEnlargen = false;

        $scope.clearComment = function(){
            CaseDetailsService.commentText = '';
            CaseDiscussionService.commentTextBoxEnlargen = false;
            CaseDetailsService.localStorageCache.remove(CaseDetailsService.kase.case_number+securityService.loginStatus.authedUser.sso_username);
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

                CaseDetailsService.populateComments(CaseService.kase.case_number).then(function (comments) {
                    $scope.addingComment = false;
                    $scope.savingDraft = false;
                    CaseDetailsService.draftSaved = false;
                    CaseDetailsService.draftComment = undefined;
                    CaseDiscussionService.commentTextBoxEnlargen = false;
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
                $scope.progressCount = 0;
                $scope.charactersLeft = 0;

                if(securityService.loginStatus.authedUser.sso_username !== undefined && CaseService.updatedNotifiedUsers.indexOf(securityService.loginStatus.authedUser.sso_username) === -1){
                    strataService.cases.notified_users.add(CaseService.kase.case_number, securityService.loginStatus.authedUser.sso_username).then(function () {
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
            if(!CaseDetailsService.disableAddComment && CaseService.commentText !== 'undefined'){
                $scope.addingComment = true;
                if(CaseDetailsService.localStorageCache) {
                    if(CaseDetailsService.draftCommentOnServerExists)
                    {
                        strataService.cases.comments.put(CaseDetailsService.kase.case_number, CaseDetailsService.commentText, false, CaseDetailsService.isCommentPublic, CaseDetailsService.draftComment.id).then(onSuccess, onError);
                    }
                    else {
                        strataService.cases.comments.post(CaseDetailsService.kase.case_number, CaseDetailsService.commentText, CaseDetailsService.isCommentPublic, false).then(onSuccess, onError);
                    }
                }
                else {
                    if (RHAUtils.isNotEmpty(CaseDetailsService.draftComment)) {
                        strataService.cases.comments.put(CaseDetailsService.kase.case_number, CaseDetailsService.commentText, false, CaseDetailsService.isCommentPublic, CaseDetailsService.draftComment.id).then(onSuccess, onError);
                    } else {
                        strataService.cases.comments.post(CaseDetailsService.kase.case_number, CaseDetailsService.commentText, CaseDetailsService.isCommentPublic, false).then(onSuccess, onError);
                    }
                }
            }
            if ((CaseAttachmentsService.updatedAttachments.length > 0 || CaseAttachmentsService.hasBackEndSelections()) && EDIT_CASE_CONFIG.showAttachments) {
                $scope.addingattachment = true;
                CaseAttachmentsService.updateAttachments(CaseDetailsService.kase.case_number).then(function () {
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
            if(CaseDetailsService.localStorageCache)
            {
                if(CaseDetailsService.draftCommentOnServerExists)
                {
                    CaseDetailsService.draftCommentLocalStorage = {'text': CaseDetailsService.commentText,
                        'id': CaseDetailsService.draftComment.id,
                        'draft': true,
                        'public': CaseDetailsService.isCommentPublic,
                        'case_number': CaseDetailsService.kase.case_number
                    };
                }
                else {
                    CaseDetailsService.draftCommentLocalStorage = {
                        'text': CaseDetailsService.commentText,
                        'draft': true,
                        'public': CaseDetailsService.isCommentPublic,
                        'case_number': CaseDetailsService.kase.case_number
                    };
                }
                if(RHAUtils.isEmpty(CaseDetailsService.commentText))
                {
                    CaseDetailsService.draftCommentLocalStorage.public=false;
                }
                CaseDetailsService.localStorageCache.put(CaseDetailsService.kase.case_number+securityService.loginStatus.authedUser.sso_username,CaseDetailsService.draftCommentLocalStorage);
                CaseDetailsService.disableAddComment = false;
                if (RHAUtils.isEmpty(CaseDetailsService.commentText)) {
                    CaseDetailsService.disableAddComment = true;
                }
            }
            else {
                if (RHAUtils.isNotEmpty(CaseDetailsService.commentText) && !$scope.addingComment) {
                    CaseDetailsService.disableAddComment = false;
                    $timeout.cancel($scope.saveDraftPromise);
                    $scope.saveDraftPromise = $timeout(function () {
                        if (!$scope.addingComment && CaseDetailsService.commentText !== '') {
                            $scope.saveDraft();
                        }
                    }, 5000);
                } else if (RHAUtils.isEmpty(CaseDetailsService.commentText)) {
                    CaseDetailsService.disableAddComment = true;
                }
            }
        };

        $scope.onCommentPublicChange = function () {
            if(RHAUtils.isNotEmpty(CaseDetailsService.commentText))
            {
                $scope.onNewCommentKeypress();
            }

        };
        $scope.$watch('CaseService.commentText', function() {
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
            $scope.savingDraft = true;
            if (!securityService.loginStatus.authedUser.is_internal) {
                CaseDetailsService.isCommentPublic = true;
            }
            var onSuccess = function (commentId) {
                $scope.savingDraft = false;
                CaseDetailsService.draftSaved = true;
                CaseDetailsService.draftComment = {
                    'text': CaseDetailsService.commentText,
                    'id': RHAUtils.isNotEmpty(commentId) ? commentId : CaseDetailsService.draftComment.id,
                    'draft': true,
                    'public': CaseDetailsService.isCommentPublic,
                    'case_number': CaseDetailsService.kase.case_number
                };
            };
            var onFailure = function (error) {
                AlertService.addStrataErrorMessage(error);
                $scope.savingDraft = false;
            };
            if (RHAUtils.isNotEmpty(CaseDetailsService.draftComment)) {
                //draft update
                strataService.cases.comments.put(CaseDetailsService.kase.case_number, CaseDetailsService.commentText, true, CaseDetailsService.isCommentPublic, CaseDetailsService.draftComment.id).then(onSuccess, onFailure);
            } else {
                //initial draft save
                strataService.cases.comments.post(CaseDetailsService.kase.case_number, CaseDetailsService.commentText, CaseDetailsService.isCommentPublic, true).then(onSuccess, onFailure);
            }
        };
        $scope.shouldTextboxMinimize = function(){
            if(CaseDetailsService.commentText === undefined || CaseDetailsService.commentText === ''){
                CaseDiscussionService.commentTextBoxEnlargen=false;
            }
        };

    }

]);
