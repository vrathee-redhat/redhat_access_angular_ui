'use strict';

export default class ProceedWithoutAttachModal {
    constructor($scope, $uibModalInstance, $sce, AttachmentsService, RHAUtils) {
        'ngInject';

        $scope.AttachmentsService = AttachmentsService;
        $scope.closeModal = function (proceed) {
            AttachmentsService.proceedWithoutAttachments = proceed;
            $uibModalInstance.close();
        };
        $scope.parseArtifactHtml = function () {
            var parsedHtml = '';
            if (RHAUtils.isNotEmpty(AttachmentsService.suggestedArtifact.description)) {
                var rawHtml = AttachmentsService.suggestedArtifact.description.toString();
                parsedHtml = $sce.trustAsHtml(rawHtml);
            }
            return parsedHtml;
        };
    }
}
