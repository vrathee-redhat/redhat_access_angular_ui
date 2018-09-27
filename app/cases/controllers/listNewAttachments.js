'use strict';

export default class ListNewAttachments {
    constructor($scope, AttachmentsService, TreeViewSelectorUtils) {
        'ngInject';

        $scope.AttachmentsService = AttachmentsService;
        $scope.TreeViewSelectorUtils = TreeViewSelectorUtils;
        $scope.removeLocalAttachment = function ($index, abortUpload) {
            const attachment = AttachmentsService.updatedAttachments[$index];

            if (abortUpload) {
                AttachmentsService.abortUpload(attachment);
            }

            AttachmentsService.removeUpdatedAttachment($index);
        };
    }
}
