'use strict';
/*global $, draftComment*/
/*jshint camelcase: false, expr: true*/
angular.module('RedhatAccess.cases').controller('AddCommentSection', [
    '$scope',
    'strataService',
    'CaseService',
    'AlertService',
    'securityService',
    '$timeout',
    'RHAUtils',
    function ($scope, strataService, CaseService, AlertService, securityService, $timeout, RHAUtils) {
        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
        $scope.addingComment = false;
        $scope.progressCount = 0;
        $scope.maxCommentLength = '32000';

        $scope.addComment = function () {
            $scope.addingComment = true;
            if (!securityService.loginStatus.authedUser.is_internal) {
                CaseService.isCommentPublic = true;
            }
            var onSuccess = function (response) {
                CaseService.draftCommentOnServerExists=false;
                if(CaseService.localStorageCache)
                {
                    CaseService.localStorageCache.remove(CaseService.kase.case_number+securityService.loginStatus.authedUser.sso_username);
                }
                if (RHAUtils.isNotEmpty($scope.saveDraftPromise)) {
                    $timeout.cancel($scope.saveDraftPromise);
                }
                CaseService.commentText = '';
                CaseService.disableAddComment = true;
                //TODO: find better way than hard code
                var status = {};
                if (!securityService.loginStatus.authedUser.is_internal && CaseService.kase.status.name === 'Closed') {
                    status = { name: 'Waiting on Red Hat' };
                    CaseService.kase.status = status;
                }

                if(securityService.loginStatus.authedUser.is_internal){
                    if (CaseService.kase.status.name === 'Waiting on Red Hat') {
                        status = { name: 'Waiting on Customer' };
                        CaseService.kase.status = status;
                    }
                }else {
                    if (CaseService.kase.status.name === 'Waiting on Customer') {
                        status = { name: 'Waiting on Red Hat' };
                        CaseService.kase.status = status;
                    }
                }

                CaseService.populateComments(CaseService.kase.case_number).then(function (comments) {
                    $scope.addingComment = false;
                    $scope.savingDraft = false;
                    CaseService.draftSaved = false;
                    CaseService.draftComment = undefined;
                });
                $scope.progressCount = 0;

                if(securityService.loginStatus.authedUser.sso_username !== undefined && CaseService.updatedNotifiedUsers.indexOf(securityService.loginStatus.authedUser.sso_username) === -1){
                    strataService.cases.notified_users.add(CaseService.kase.case_number, securityService.loginStatus.authedUser.sso_username).then(function () {
                        CaseService.updatedNotifiedUsers.push(securityService.loginStatus.authedUser.sso_username);
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                }
                
            };
            var onError = function (error) {
                AlertService.addStrataErrorMessage(error);
                $scope.addingComment = false;
                $scope.progressCount = 0;
            };
            if(CaseService.localStorageCache) {
                if(CaseService.draftCommentOnServerExists)
                {
                    strataService.cases.comments.put(CaseService.kase.case_number, CaseService.commentText, false, CaseService.isCommentPublic, CaseService.draftComment.id).then(onSuccess, onError);
                }
                else {
                    strataService.cases.comments.post(CaseService.kase.case_number, CaseService.commentText, CaseService.isCommentPublic, false).then(onSuccess, onError);
                }
            }
            else {
                if (RHAUtils.isNotEmpty(CaseService.draftComment)) {
                    strataService.cases.comments.put(CaseService.kase.case_number, CaseService.commentText, false, CaseService.isCommentPublic, CaseService.draftComment.id).then(onSuccess, onError);
                } else {
                    strataService.cases.comments.post(CaseService.kase.case_number, CaseService.commentText, CaseService.isCommentPublic, false).then(onSuccess, onError);
                }
            }
        };
        $scope.saveDraftPromise;
        $scope.onNewCommentKeypress = function () {
            if(CaseService.localStorageCache)
            {
                if(CaseService.draftCommentOnServerExists)
                {
                    CaseService.draftCommentLocalStorage = {'text': CaseService.commentText,
                        'id': CaseService.draftComment.id,
                        'draft': true,
                        'public': CaseService.isCommentPublic,
                        'case_number': CaseService.kase.case_number
                    };
                }
                else {
                    CaseService.draftCommentLocalStorage = {
                        'text': CaseService.commentText,
                        'draft': true,
                        'public': CaseService.isCommentPublic,
                        'case_number': CaseService.kase.case_number
                    };
                }
                if(RHAUtils.isEmpty(CaseService.commentText))
                {
                    CaseService.draftCommentLocalStorage.public=false;
                }
                CaseService.localStorageCache.put(CaseService.kase.case_number+securityService.loginStatus.authedUser.sso_username,CaseService.draftCommentLocalStorage);
                CaseService.disableAddComment = false;
                if (RHAUtils.isEmpty(CaseService.commentText)) {
                    CaseService.disableAddComment = true;
                }
            }
            else {
                if (RHAUtils.isNotEmpty(CaseService.commentText) && !$scope.addingComment) {
                    CaseService.disableAddComment = false;
                    $timeout.cancel($scope.saveDraftPromise);
                    $scope.saveDraftPromise = $timeout(function () {
                        if (!$scope.addingComment && CaseService.commentText !== '') {
                            $scope.saveDraft();
                        }
                    }, 5000);
                } else if (RHAUtils.isEmpty(CaseService.commentText)) {
                    CaseService.disableAddComment = true;
                }
            }
        };

        $scope.onCommentPublicChange = function () {
            if(RHAUtils.isNotEmpty(CaseService.commentText))
            {
                $scope.onNewCommentKeypress();
            }

        };
        $scope.$watch('CaseService.commentText', function() {
            $scope.maxCharacterCheck();
        });
        $scope.maxCharacterCheck = function() {
            if (CaseService.commentText !== undefined && $scope.maxCommentLength  > CaseService.commentText.length) {
                var count = CaseService.commentText.length * 100 / $scope.maxCommentLength ;
                parseInt(count);
                $scope.progressCount = Math.round(count * 100) / 100;
            }
            else if(CaseService.commentText===undefined)
            {
                $scope.progressCount=0;
            }
        };
        $scope.saveDraft = function () {
            $scope.savingDraft = true;
            if (!securityService.loginStatus.authedUser.is_internal) {
                CaseService.isCommentPublic = true;
            }
            var onSuccess = function (commentId) {
                $scope.savingDraft = false;
                CaseService.draftSaved = true;
                CaseService.draftComment = {
                    'text': CaseService.commentText,
                    'id': RHAUtils.isNotEmpty(commentId) ? commentId : CaseService.draftComment.id,
                    'draft': true,
                    'public': CaseService.isCommentPublic,
                    'case_number': CaseService.kase.case_number
                };
            };
            var onFailure = function (error) {
                AlertService.addStrataErrorMessage(error);
                $scope.savingDraft = false;
            };
            if (RHAUtils.isNotEmpty(CaseService.draftComment)) {
                //draft update
                strataService.cases.comments.put(CaseService.kase.case_number, CaseService.commentText, true, CaseService.isCommentPublic, CaseService.draftComment.id).then(onSuccess, onFailure);
            } else {
                //initial draft save
                strataService.cases.comments.post(CaseService.kase.case_number, CaseService.commentText, CaseService.isCommentPublic, true).then(onSuccess, onFailure);
            }
        };
    }
]);
