'use strict';
/*global $ */
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('RequestManagementEscalationModal', [
    '$scope',
    '$modalInstance',
    'AlertService',
    'CaseService',
    'strataService',
    '$q',
    '$stateParams',
    function ($scope, $modalInstance, AlertService, CaseService, strataService, $q, $stateParams) {
        $scope.CaseService = CaseService;
        $scope.commentText = CaseService.commentText;
        $scope.submittingRequest = false;
        $scope.submitRequestClick = angular.bind($scope, function (commentText) {
            $scope.submittingRequest = true;
            var promises = [];
            var fullComment = 'Request Management Escalation: ' + commentText;
            var postComment;
            if (CaseService.draftComment) {
                postComment = strataService.cases.comments.put(CaseService.kase.case_number, fullComment, false, CaseService.draftComment.id);
            } else {
                postComment = strataService.cases.comments.post(CaseService.kase.case_number, fullComment, false);
            }
            postComment.then(function (response) {
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            promises.push(postComment);
            var caseJSON = { 'escalated': true };
            var updateCase = strataService.cases.put(CaseService.kase.case_number, caseJSON);
            updateCase.then(function (response) {
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            promises.push(updateCase);
            var masterPromise = $q.all(promises);
            masterPromise.then(function (response) {
                CaseService.populateComments($stateParams.id).then(function (comments) {
                    CaseService.refreshComments();
                    $scope.closeModal();
                    $scope.submittingRequest = false;
                });
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            return masterPromise;
        });
        $scope.closeModal = function () {
            $modalInstance.close();
        };
    }
]);
