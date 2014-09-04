'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('CommentsSection', [
    '$scope',
    'CaseService',
    'strataService',
    '$stateParams',
    'AlertService',
    '$modal',
    '$location',
    '$anchorScroll',
    'RHAUtils',
    function ($scope, CaseService, strataService, $stateParams, AlertService, $modal, $location, $anchorScroll, RHAUtils) {
        $scope.CaseService = CaseService;

        CaseService.populateComments($stateParams.id).then(function (comments) {
            if (RHAUtils.isNotEmpty(comments)) {
                CaseService.selectCommentsPage(1);
                //CaseService.refreshComments();
            }
            $scope.$on('rhaCaseSettled', function() {
                $scope.$evalAsync(function() {
                    CaseService.scrollToComment($location.search().commentId);
                });
            });
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
