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
    'AlertService',
    'securityService',
    '$rootScope',
    'AUTH_EVENTS',
    '$location',
    function ($scope,
      $state,
      $q,
      SearchResultsService,
      AttachmentsService,
      strataService,
      RecommendationsService,
      CaseService,
      AlertService,
      securityService,
      $rootScope,
      AUTH_EVENTS,
      $location) {

      $scope.versions = [];
      $scope.versionDisabled = true;
      $scope.versionLoading = false;
      $scope.incomplete = true;
      $scope.submitProgress = 0;
      AttachmentsService.clear();
      CaseService.clearCase();
      RecommendationsService.clear();
      SearchResultsService.clear();
      AlertService.clearAlerts();

      $scope.CaseService = CaseService;
      $scope.RecommendationsService = RecommendationsService;
      $scope.securityService = securityService;

      $scope.getRecommendations = function () {
        SearchResultsService.searchInProgress.value = true;
        RecommendationsService.populateRecommendations(5).then(
          function () {
            SearchResultsService.clear();

            RecommendationsService.recommendations.forEach(
              function (recommendation) {
                SearchResultsService.add(recommendation);
              }
            )
            SearchResultsService.searchInProgress.value = false;
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );
      };

      /**
       * Populate the selects
       */
      $scope.initSelects = function () {
        $scope.productsLoading = true;
        strataService.products.list().then(
          function (products) {
            $scope.products = products;
            $scope.productsLoading = false;
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );

        $scope.severitiesLoading = true;
        strataService.values.cases.severity().then(
          function (severities) {
            $scope.severities = severities;
            CaseService.
          case .severity = severities[severities.length - 1];
          $scope.severitiesLoading = false;
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );

        $scope.groupsLoading = true;
        strataService.groups.list().then(
          function (groups) {
            $scope.groups = groups;
            $scope.groupsLoading = false;
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );
      };

      $scope.initDescription = function () {
        var searchObject = $location.search();
        if (searchObject.data) {
          CaseService.case.description = searchObject.data;
        } else {
          //angular does not  handle params before hashbang
          //@see https://github.com/angular/angular.js/issues/6172
          var queryParamsStr = window.location.search.substring(1);
          var parameters = queryParamsStr.split('&');
          for (var i = 0; i < parameters.length; i++) {
            var parameterName = parameters[i].split('=');
            if (parameterName[0] == 'data') {
              CaseService.case.description = decodeURIComponent(parameterName[1]);
            }
          }
        }
      };

      $scope.initSelects();
      $scope.initDescription();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
        $scope.initSelects();
        $scope.initDescription();
        AlertService.clearAlerts();
      });

      /**
       * Set $scope.incomplete to boolean based on state of form
       */
      $scope.validateForm = function () {
        if (CaseService.case.product == null ||
          CaseService.case.product == "" ||
          CaseService.case.version == null ||
          CaseService.case.version == "" ||
          CaseService.case.summary == null ||
          CaseService.case.summary == "" ||
          CaseService.case.description == null ||
          CaseService.case.description == "") {
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
        CaseService.
      case .version = "";
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
          AlertService.addStrataErrorMessage(error);
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

      $scope.submittingCase = false;
      /**
       * Create the case with attachments
       */
      $scope.doSubmit = function () {
        var caseJSON = {
          'product': CaseService.case.product.code,
          'version':CaseService.case.version,
          'summary':CaseService.case.summary,
          'description':CaseService.case.description,
          'severity':CaseService.case.severity.name,
          'folderNumber':CaseService.case.caseGroup == null ? '' : CaseService.case.caseGroup.number
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
                },
                function (error) {
                  AlertService.addStrataErrorMessage(error);
                }
              );
            }
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );
      };

      $scope.gotoPage(1);
    }
  ]);