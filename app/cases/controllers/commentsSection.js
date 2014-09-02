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
        CaseService.populateComments($stateParams.id).then(function (comments) {
            if (RHAUtils.isNotEmpty(comments)) {
                CaseService.selectCommentsPage(1);
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
    }
]);
