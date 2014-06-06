'use strict';
 /*jshint camelcase: false */
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
  '$rootScope',
  'AUTH_EVENTS',
  'AlertService',
  'securityService',
  function(
      $scope,
      $stateParams,
      $filter,
      $q,
      AttachmentsService,
      CaseService,
      strataService,
      RecommendationsService,
      $rootScope,
      AUTH_EVENTS,
      AlertService,
      securityService) {

    $scope.securityService = securityService;
    $scope.AttachmentsService = AttachmentsService;
    $scope.CaseService = CaseService;
    CaseService.clearCase();

    $scope.init = function() {
      $scope.caseLoading = true;
      $scope.recommendationsLoading = true;

      strataService.cases.get($stateParams.id).then(
          function(caseJSON) {
            CaseService.defineCase(caseJSON);
            $scope.caseLoading = false;

            if ('product' in caseJSON && 'name' in caseJSON.product && caseJSON.product.name) {
              strataService.products.versions(caseJSON.product.name).then(
                  function(versions) {
                    CaseService.versions = versions;
                  },
                  function(error) {
                    AlertService.addStrataErrorMessage(error);
                  }
              );
            }

            if (caseJSON.account_number !== undefined) {
              strataService.accounts.get(caseJSON.account_number).then(
                  function(account) {
                    CaseService.defineAccount(account);
                  },
                  function(error) {
                    AlertService.addStrataErrorMessage(error);
                  }
              );
            }

            RecommendationsService.populateRecommendations(12).then(
                function() {
                  $scope.recommendationsLoading = false;
                },
                function(error) {
                  AlertService.addStrataErrorMessage(error);
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
            AlertService.addStrataErrorMessage(error);
          }
      );

      strataService.cases.comments.get($stateParams.id).then(
          function(commentsJSON) {
            $scope.comments = commentsJSON;
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
          }
      );
    };
    $scope.init();

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      $scope.init();
      AlertService.clearAlerts();
    });
  }
]);

