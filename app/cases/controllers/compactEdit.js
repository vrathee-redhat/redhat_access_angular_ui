'use strict';

angular.module('RedhatAccess.cases')
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
    $scope.domReady = false;

    strataService.cases.get($stateParams.id).then(
      function(caseJSON) {
        CaseService.defineCase(caseJSON);
        $scope.caseLoading = false;

        strataService.products.versions(caseJSON.product.name).then(
            function(versions) {
              CaseService.versions = versions;
            }
        );

        $scope.domReady = true;
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


  }
]);
