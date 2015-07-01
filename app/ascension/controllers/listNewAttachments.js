'use strict';
angular.module('RedhatAccess.ascension').controller('ListNewAttachment', [
    '$scope',
    'CaseAttachmentsService',
    'TreeViewSelectorUtils',
    function ($scope, CaseAttachmentsService, TreeViewSelectorUtils) {
        $scope.CaseAttachmentsService = CaseAttachmentsService;
        $scope.TreeViewSelectorUtils = TreeViewSelectorUtils;
        $scope.removeLocalAttachment = function ($index) {
            CaseAttachmentsService.removeUpdatedAttachment($index);
        };
    }
]);
