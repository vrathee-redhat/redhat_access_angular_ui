'use strict';

angular.module('RedhatAccess.cases')
  .controller('New', [
    '$scope',
    '$state',
    '$q',
    'SearchResultsService',
    'AttachmentsService',
    'strataService',
    'RecommendationsService',
    'CaseService',
    function ($scope,
              $state,
              $q,
              SearchResultsService,
              AttachmentsService,
              strataService,
              RecommendationsService,
              CaseService) {

      $scope.versions = [];
      $scope.versionDisabled = true;
      $scope.versionLoading = false;
      $scope.incomplete = true;
      $scope.submitProgress = 0;
      AttachmentsService.clear();
      CaseService.clearCase();
      RecommendationsService.clear();
      SearchResultsService.clear();

      $scope.CaseService = CaseService;
      $scope.RecommendationsService = RecommendationsService;

      $scope.getRecommendations = function() {
        RecommendationsService.populateRecommendations(5).then(
            function() {
              SearchResultsService.clear();

              RecommendationsService.recommendations.forEach(
                  function(recommendation) {
                    SearchResultsService.add(recommendation);
                  }
              )
            }
        );
      };

      $scope.productsLoading = true;
      strataService.products.list().then(
          function(products) {
            $scope.products = products;
            $scope.productsLoading = false;
          }
      );

      $scope.severitiesLoading = true;
      strataService.values.cases.severity().then(
          function(severities) {
            $scope.severities = severities;
            CaseService.case.severity = severities[severities.length - 1];
            $scope.severitiesLoading = false;
          }
      );

      $scope.groupsLoading = true;
      strataService.groups.list().then(
          function(groups) {
            $scope.groups = groups;
            $scope.groupsLoading = false;
          }
      );

      $scope.validateForm = function () {
        if (CaseService.case.product == null || CaseService.case.product == "" ||
          CaseService.case.version == null || CaseService.case.version == "" ||
          CaseService.case.summary == null || CaseService.case.summary == "" ||
          CaseService.case.description == null || CaseService.case.description == "") {
          $scope.incomplete = true;
        } else {
          $scope.incomplete = false;
        }
      };

      /**
       * Retrieve product's versions from strata
       *
       * @param product
       */
      $scope.getProductVersions = function (product) {
        CaseService.case.version = "";
        $scope.versionDisabled = true;
        $scope.versionLoading = true;

        strata.products.versions(
          product.code,
          function (response) {
            $scope.versions = response;
            $scope.validateForm();
            $scope.versionDisabled = false;
            $scope.versionLoading = false;
            $scope.$apply();
          },
          function (error) {
            console.log(error);
          });
      };

      /**
       * Go to a page in the wizard
       *
       * @param page
       */
      $scope.gotoPage = function (page) {
        $scope.isPage1 = page == 1 ? true : false;
        $scope.isPage2 = page == 2 ? true : false;
      };

      /**
       * Navigate forward in the wizard
       */
      $scope.doNext = function () {
        $scope.gotoPage(2);
      };

      /**
       * Navigate back in the wizard
       */
      $scope.doPrevious = function () {
        $scope.gotoPage(1);
      };

      /**
       * Return promise for a single attachment
       */
      var postAttachment = function (caseNumber, attachment, progressIncrement) {

        var singleAttachmentSuccess = function (response) {
          $scope.submitProgress = $scope.submitProgress + progressIncrement;
        };

        var deferred = $q.defer();
        deferred.promise.then(singleAttachmentSuccess);

        strata.cases.attachments.post(
          attachment,
          caseNumber,
          function (response) {
            deferred.resolve(response);
          },
          function (error, error2, error3, error4) {
            console.log(error);
            deferred.reject(error);
          }
        );

        return deferred.promise;
      };

      $scope.submittingCase = false;

      /**
       * Create the case with attachments
       */
      $scope.doSubmit = function () {

        var caseJSON = {
          'product': CaseService.case.product.code,
          'version': CaseService.case.version,
          'summary': CaseService.case.summary,
          'description': CaseService.case.description,
          'severity': CaseService.case.severity.name,
          'folderNumber': CaseService.case.caseGroup == null ? '' : CaseService.case.caseGroup.number
        };
        $scope.submittingCase = true;
        strata.cases.post(
          caseJSON,
          function (caseNumber) {
            if ((AttachmentsService.updatedAttachments.length > 0) || (AttachmentsService.hasBackEndSelections())) {
              AttachmentsService.updateAttachments(caseNumber).then(
                function () {
                  $state.go('edit', {
                    id: caseNumber
                  });
                  $scope.submittingCase = false;
                }
              );
            }
          },
          function (error) {
            console.log(error);
          }
        );

      };

      $scope.gotoPage(1);
    }
  ]);