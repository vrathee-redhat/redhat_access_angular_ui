'use strict';

angular.module('RedhatAccessCases')
  .controller('New', [
    '$scope',
    '$state',
    '$q',
    'SearchResultsService',
    'AttachmentsService',
    'productsJSON',
    'severityJSON',
    'groupsJSON',
    function ($scope, $state, $q, SearchResultsService, AttachmentsService, productsJSON, severityJSON, groupsJSON) {
      $scope.products = productsJSON;
      $scope.versions = [];
      $scope.versionDisabled = true;
      $scope.versionLoading = false;
      $scope.incomplete = true;
      $scope.severities = severityJSON;
      $scope.severity = severityJSON[severityJSON.length - 1];
      $scope.groups = groupsJSON;
      $scope.submitProgress = 0;
      AttachmentsService.clear();

      $scope.validateForm = function () {
        if ($scope.product == null || $scope.product == "" ||
          $scope.version == null || $scope.version == "" ||
          $scope.summary == null || $scope.summary == "" ||
          $scope.description == null || $scope.description == "") {
          $scope.incomplete = true;
        } else {
          $scope.incomplete = false;
        }
      };

      $scope.loadingRecommendations = false;

      $scope.setCurrentData = function () {
        $scope.currentData = {
          product: $scope.product,
          version: $scope.version,
          summary: $scope.summary,
          description: $scope.description
        };
      };

      $scope.setCurrentData();

      $scope.getRecommendations = function () {

        var newData = {
          product: $scope.product,
          version: $scope.version,
          summary: $scope.summary,
          description: $scope.description
        };

        if (!angular.equals($scope.currentData, newData) && !$scope.loadingRecommendations) {
          $scope.loadingRecommendations = true;

          var data = {
            product: $scope.product,
            version: $scope.version,
            summary: $scope.summary,
            description: $scope.desecription
          };
          $scope.setCurrentData();

          var deferreds = [];

          strata.problems(
            data,
            function (solutions) {
              //retrieve details for each solution
              solutions.forEach(function (solution) {
                var deferred = $q.defer();
                deferreds.push(deferred.promise);

                strata.solutions.get(
                  solution.uri,
                  function (solution) {
                    deferred.resolve(solution);
                  },
                  function (error) {
                    deferred.resolve();
                  });
              });

              $q.all(deferreds).then(
                function (solutions) {
                  SearchResultsService.clear();

                  solutions.forEach(function (solution) {
                    if (solution !== undefined) {
                      solution.resource_type = "Solution";
                      SearchResultsService.add(solution);
                    }
                  });
                  $scope.loadingRecommendations = false;
                },
                function (error) {
                  $scope.loadingRecommendations = false;
                }
              );
            },
            function (error) {
              $scope.loadingRecommendations = false;
              console.log(error);
            },
            5
          );
        }
      };

      /**
       * Retrieve product's versions from strata
       *
       * @param product
       */
      $scope.getProductVersions = function (product) {
        $scope.version = "";
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
          'product': $scope.product.code,
          'version': $scope.version,
          'summary': $scope.summary,
          'description': $scope.description,
          'severity': $scope.severity.name,
          'folderNumber': $scope.caseGroup == null ? '' : $scope.caseGroup.number
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