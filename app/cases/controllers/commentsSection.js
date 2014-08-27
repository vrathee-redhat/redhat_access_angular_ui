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
    'RHAUtils',
    function ($scope, CaseService, strataService, $stateParams, AlertService, $timeout, $modal, RHAUtils) {
        $scope.CaseService = CaseService;
        CaseService.refreshComments = function () {
            $scope.selectPage(1);
        };
        CaseService.populateComments($stateParams.id).then(function (comments) {
            if (RHAUtils.isNotEmpty(comments)) {
                CaseService.refreshComments();
            }
        });
        $scope.itemsPerPage = 4;
        $scope.maxPagerSize = 3;
        $scope.selectPage = function (pageNum) {
            var start = $scope.itemsPerPage * (pageNum - 1);
            var end = start + $scope.itemsPerPage;
            end = end > CaseService.comments.length ? CaseService.comments.length : end;
            $scope.commentsOnScreen = CaseService.comments.slice(start, end);
        };
        $scope.requestManagementEscalation = function () {
            $modal.open({
                templateUrl: 'cases/views/requestManagementEscalationModal.html',
                controller: 'RequestManagementEscalationModal'
            });
        };
        if (RHAUtils.isNotEmpty(CaseService.comments)) {
            CaseService.refreshComments();
        }
    }
]);