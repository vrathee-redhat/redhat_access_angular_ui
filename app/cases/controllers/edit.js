'use strict';

angular.module('RedhatAccess.cases')
.controller('Edit', [
  '$scope',
  '$stateParams',
  '$filter',
  '$q',
  'AttachmentsService',
  'CaseService',
  'strataService',
  function(
      $scope,
      $stateParams,
      $filter,
      $q,
      AttachmentsService,
      CaseService,
      strataService) {

    $scope.AttachmentsService = AttachmentsService;
    $scope.CaseService = CaseService;
    CaseService.clearCase();

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

          if (caseJSON.account_number != null) {
            strataService.accounts.get(caseJSON.account_number).then(
                function(account) {
                  CaseService.defineAccount(account);
                }
            );
          }

          //TODO: get recommendations
        }
    );

    $scope.attachmentsLoading = true;
    strataService.cases.attachments.list($stateParams.id).then(
        function(attachmentsJSON) {
          AttachmentsService.defineOriginalAttachments(attachmentsJSON);
          $scope.attachmentsLoading = false;
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
  }]);

