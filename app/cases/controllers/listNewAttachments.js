'use strict';

export default class ListNewAttachments {
    constructor($scope, AttachmentsService, TreeViewSelectorUtils) {
        'ngInject';

        $scope.AttachmentsService = AttachmentsService;
        $scope.TreeViewSelectorUtils = TreeViewSelectorUtils;
        $scope.removeLocalAttachment = function ($index) {
            AttachmentsService.removeUpdatedAttachment($index);
        };
    }
}
