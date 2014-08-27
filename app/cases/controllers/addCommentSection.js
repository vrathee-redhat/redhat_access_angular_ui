'use strict';
/*global $, draftComment*/
/*jshint camelcase: false, expr: true*/
angular.module('RedhatAccess.cases').controller('AddCommentSection', [
    '$scope',
    'strataService',
    'CaseService',
    'AlertService',
    '$timeout',
    'RHAUtils',
    function ($scope, strataService, CaseService, AlertService, $timeout, RHAUtils) {
        $scope.CaseService = CaseService;
        $scope.addingComment = false;
        $scope.addComment = function () {
            $scope.addingComment = true;
            var onSuccess = function (response) {
                if (RHAUtils.isNotEmpty($scope.saveDraftPromise)) {
                    $timeout.cancel($scope.saveDraftPromise);
                }
                CaseService.commentText = '';
                //TODO: find better way than hard code
                if (CaseService.kase.status.name === 'Closed') {
                    var status = { name: 'Waiting on Red Hat' };
                    CaseService.kase.status = status;
                }
                CaseService.populateComments(CaseService.kase.case_number).then(function (comments) {
                    $scope.addingComment = false;
                    $scope.savingDraft = false;
                    $scope.draftSaved = false;
                    CaseService.draftComment = undefined;
                    CaseService.refreshComments();
                });
            };
            var onError = function (error) {
                AlertService.addStrataErrorMessage(error);
                $scope.addingComment = false;
            };
            if (RHAUtils.isNotEmpty(CaseService.draftComment)) {
                strataService.cases.comments.put(CaseService.kase.case_number, CaseService.commentText, false, CaseService.draftComment.id).then(onSuccess, onError);
            } else {
                strataService.cases.comments.post(CaseService.kase.case_number, CaseService.commentText).then(onSuccess, onError);
            }
        };
        $scope.saveDraftPromise;
        $scope.onNewCommentKeypress = function () {
            if (RHAUtils.isNotEmpty(CaseService.commentText) && !$scope.addingComment) {
                $timeout.cancel($scope.saveDraftPromise);
                $scope.saveDraftPromise = $timeout(function () {
                    if (!$scope.addingComment) {
                        $scope.saveDraft();
                    }
                }, 5000);
            }
        };
        $scope.saveDraft = function () {
            $scope.savingDraft = true;
            var onSuccess = function (commentId) {
                $scope.savingDraft = false;
                $scope.draftSaved = true;
                CaseService.draftComment = {
                    'text': CaseService.commentText,
                    'id': RHAUtils.isNotEmpty(commentId) ? commentId : draftComment.id,
                    'draft': true,
                    'case_number': CaseService.kase.case_number
                };
            };
            var onFailure = function (error) {
                AlertService.addStrataErrorMessage(error);
                $scope.savingDraft = false;
            };
            if (RHAUtils.isNotEmpty(CaseService.draftComment)) {
                //draft update
                strataService.cases.comments.put(CaseService.kase.case_number, CaseService.commentText, true, CaseService.draftComment.id).then(onSuccess, onFailure);
            } else {
                //initial draft save
                strataService.cases.comments.post(CaseService.kase.case_number, CaseService.commentText, true).then(onSuccess, onFailure);
            }
        };
    }
]);
