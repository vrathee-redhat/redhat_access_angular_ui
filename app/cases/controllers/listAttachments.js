'use strict';

export default class ListAttachments {
    constructor($scope, AttachmentsService) {
        'ngInject';

        $scope.AttachmentsService = AttachmentsService;
    }
}
