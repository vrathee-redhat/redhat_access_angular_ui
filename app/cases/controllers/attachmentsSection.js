'use strict';

angular.module('RedhatAccess.cases')
  .controller('AttachmentsSection', [
    '$scope',
    'AttachmentsService',
    'CaseService',
    function (
      $scope,
      AttachmentsService,
      CaseService) {

      $scope.AttachmentsService = AttachmentsService;
      $scope.CaseService = CaseService;

      $scope.doUpdate = function () {
        $scope.updatingAttachments = true;
        AttachmentsService.updateAttachments(CaseService.
        case .case_number).then(
          function () {
            $scope.updatingAttachments = false;
          }
        );
      };
    }
  ]);