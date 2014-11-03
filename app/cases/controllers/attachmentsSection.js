'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('AttachmentsSection', [
    '$scope',
    'AttachmentsService',
    'CaseService',
    'TreeViewSelectorUtils',
    'EDIT_CASE_CONFIG',
    function ($scope, AttachmentsService, CaseService, TreeViewSelectorUtils, EDIT_CASE_CONFIG) {
        $scope.rhaDisabled = !EDIT_CASE_CONFIG.showAttachments;
        $scope.showServerSideAttachments = EDIT_CASE_CONFIG.showServerSideAttachments;
        $scope.isPCM = EDIT_CASE_CONFIG.isPCM;
        $scope.ie8 = window.ie8;
        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.TreeViewSelectorUtils = TreeViewSelectorUtils;
        $scope.ie8Message="We currently do not allow file attachments to support cases in Internet Explorer 8.  Please refer to <a href=\"https://access.redhat.com/solutions/2112\">How to provide large files to Red Hat Support </a> for other options to upload attachments to support cases."
        $scope.doUpdate = function () {
            $scope.updatingAttachments = true;
            AttachmentsService.updateAttachments(CaseService.kase.case_number).then(function () {
                $scope.updatingAttachments = false;
            }, function (error) {
                $scope.updatingAttachments = false;
            });
        };
    }
]);