'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('CommentsSection', [
    '$scope',
    'CaseService',
    'strataService',
    '$stateParams',
    'AlertService',
    '$timeout',
    '$modal',
    '$location',
    '$anchorScroll',
    'RHAUtils',
    function ($scope, CaseService, strataService, $stateParams, AlertService, $timeout, $modal, $location, $anchorScroll, RHAUtils) {
        var timerRepeats = 0;
        $scope.CaseService = CaseService;
        CaseService.populateComments($stateParams.id).then(function (comments) {
            if (RHAUtils.isNotEmpty(comments)) {
                CaseService.selectCommentsPage(1);
                //CaseService.refreshComments();
                var commentId = $location.search().commentId;
                if(commentId !== undefined){
                    $timeout($scope.isCommentRendered, commentId, 500);
                }
            }
        });
        $scope.requestManagementEscalation = function () {
            $modal.open({
                templateUrl: 'cases/views/requestManagementEscalationModal.html',
                controller: 'RequestManagementEscalationModal'
            });
        };
        if (RHAUtils.isNotEmpty(CaseService.comments)) {
            CaseService.selectCommentsPage(1);
        }

        $scope.isCommentRendered = function(){
            //This feels even more terribly hacky :(
            var commentId = $location.search().commentId;
            if(document.getElementById(commentId) !== undefined ){
                timerRepeats++;
                $scope.linkToComment(commentId);
                if(timerRepeats < 5){
                    $timeout($scope.isCommentRendered, 500);
                }
            } else{
                $timeout($scope.isCommentRendered, 500);
            }
        };

        $scope.linkToComment = function (commentId) {
            //This feels terrible hacky :(
            var old = $location.hash();
            $location.hash(commentId);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
            $location.search('commentId', commentId);
        };
    }
]);
