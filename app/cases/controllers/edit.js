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
  'RecommendationsService',
  function(
      $scope,
      $stateParams,
      $filter,
      $q,
      AttachmentsService,
      CaseService,
      strataService,
      RecommendationsService) {

    $scope.AttachmentsService = AttachmentsService;
    $scope.CaseService = CaseService;
    CaseService.clearCase();

    $scope.caseLoading = true;
    $scope.recommendationsLoading = true;

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

          RecommendationsService.populateRecommendations(25).then(
              function() {
                $scope.recommendationsLoading = false;
              }
          );
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

