'use strict';

export default class BackEndAttachmentsCtrl {
    constructor($scope, $location, TreeViewSelectorData, AttachmentsService, NEW_CASE_CONFIG, EDIT_CASE_CONFIG) {
        'ngInject';
        
        $scope.name = 'Attachments';
        $scope.attachmentTree = [];
        let newCase = false;
        let editCase = false;
        if ($location.path().indexOf('new') > -1) {
            newCase = true;
        } else {
            editCase = true;
        }
        if (!$scope.rhaDisabled && newCase && NEW_CASE_CONFIG.showServerSideAttachments || !$scope.rhaDisabled && editCase && EDIT_CASE_CONFIG.showServerSideAttachments) {
            const sessionId = $location.search().sessionId;
            TreeViewSelectorData.getTree('attachments', sessionId).then(function (tree) {
                $scope.attachmentTree = tree;
                AttachmentsService.updateBackEndAttachments(tree);
            }, function () {
            });
        }
    }
}
