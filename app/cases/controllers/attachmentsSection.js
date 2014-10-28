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
        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.TreeViewSelectorUtils = TreeViewSelectorUtils;
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