'use strict';

angular.module('RedhatAccessCases')
.controller('CompactEdit', [
  '$scope',
  'strataService',
  '$stateParams',
  'CaseService',
  'AttachmentsService',
  function(
      $scope,
      strataService,
      $stateParams,
      CaseService,
      AttachmentsService) {

    $scope.caseLoading = true;

    strataService.cases.get($stateParams.id).then(
      function(caseJSON) {
        CaseService.defineCase(caseJSON);
        $scope.caseLoading = false;

        strataService.products.versions(caseJSON.product.name).then(
            function(versions) {
              CaseService.versions = versions;
            }
        );
      }
    );

    strataService.cases.attachments.list($stateParams.id).then(
        function(attachmentsJSON) {
          AttachmentsService.defineOriginalAttachments(attachmentsJSON);
        },
        function(error) {
          console.log(error);
        }
    );

    strataService.cases.comments.get($stateParams.id).then(
        function(commentsJSON) {
          $scope.comments = commentsJSON;
        },
        function(error) {
          console.log(error);
        }
    );

  }
]);
