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
    'RHAUtils',
    'NEW_DEFAULTS',
    'NEW_CASE_CONFIG',
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
      $location,
      RHAUtils,
      NEW_DEFAULTS,
      NEW_CASE_CONFIG) {

      $scope.NEW_CASE_CONFIG = NEW_CASE_CONFIG;
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
        if ($scope.NEW_CASE_CONFIG.showRecommendations) {
          SearchResultsService.searchInProgress.value = true;
          RecommendationsService.populateRecommendations(5).then(
            function () {
              SearchResultsService.clear();

              RecommendationsService.recommendations.forEach(
                function (recommendation) {
                  SearchResultsService.add(recommendation);
                }
              );
              SearchResultsService.searchInProgress.value = false;
            },
            function (error) {
              AlertService.addStrataErrorMessage(error);
            }
          );
        }
      };

      CaseService.onOwnerSelectChanged = function () {
        if (CaseService.owner != null) {
          CaseService.populateEntitlements(CaseService.owner);
          CaseService.populateGroups(CaseService.owner);
        }

        CaseService.validateNewCasePage1();
      };

      /**
       * Populate the selects
       */
      $scope.initSelects = function () {
        $scope.productsLoading = true;
        strataService.products.list(securityService.loginStatus.ssoName).then(
          function (products) {
            $scope.products = products;
            $scope.productsLoading = false;

            if (RHAUtils.isNotEmpty(NEW_DEFAULTS.product)) {
              CaseService.kase.product = {
              name: NEW_DEFAULTS.product,
              code: NEW_DEFAULTS.product
            };
            $scope.getRecommendations();
            $scope.getProductVersions(CaseService.kase.product);
            }
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );

        $scope.severitiesLoading = true;
        strataService.values.cases.severity().then(
          function (severities) {
            CaseService.severities = severities;
            CaseService.kase.severity = severities[severities.length - 1];
          $scope.severitiesLoading = false;
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );

        $scope.groupsLoading = true;
        strataService.groups.list().then(
          function (groups) {
            /*jshint camelcase: false*/
            CaseService.groups = groups;
            for (var i = 0; i < groups.length; i++) {
              if (groups[i].is_default) {
                CaseService.kase.group = groups[i];
              break;
              }
            }
            $scope.groupsLoading = false;
          },
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );
      };

      $scope.initDescription = function () {
        var searchObject = $location.search();

        var setDesc = function (desc) {
          CaseService.kase.description = desc;
        $scope.getRecommendations();
        };

        if (searchObject.data) {
          setDesc(searchObject.data);
        } else {
          //angular does not  handle params before hashbang
          //@see https://github.com/angular/angular.js/issues/6172
          var queryParamsStr = window.location.search.substring(1);
          var parameters = queryParamsStr.split('&');
          for (var i = 0; i < parameters.length; i++) {
            var parameterName = parameters[i].split('=');
            if (parameterName[0] === 'data') {
              setDesc(decodeURIComponent(parameterName[1]));
            }
          }
        }
      };

      if (securityService.loginStatus.isLoggedIn) {
        $scope.initSelects();
        $scope.initDescription();
      }

      $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
        $scope.initSelects();
        $scope.initDescription();
        AlertService.clearAlerts();
      });


      /**
       * Retrieve product's versions from strata
       *
       * @param product
       */
      $scope.getProductVersions = function (product) {
        CaseService.kase.version = '';
      $scope.versionDisabled = true;
      $scope.versionLoading = true;

      strataService.products.versions(product.code).then(
        function (response) {
          $scope.versions = response;
          CaseService.validateNewCasePage1();
          $scope.versionDisabled = false;
          $scope.versionLoading = false;

          if (RHAUtils.isNotEmpty(NEW_DEFAULTS.version)) {
            CaseService.kase.version = NEW_DEFAULTS.version;
          $scope.getRecommendations();
          }
        },
        function (error) {
          AlertService.addStrataErrorMessage(error);
        }
      );
      };

      /**
       * Go to a page in the wizard
       *
       * @param page
       */
      $scope.gotoPage = function (page) {
        $scope.isPage1 = page === 1 ? true : false;
        $scope.isPage2 = page === 2 ? true : false;
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
      $scope.doSubmit = function ($event) {
        if(window.chrometwo_require != null){
          chrometwo_require(['analytics/main'], function (analytics) {
             analytics.trigger('OpenSupportCaseSubmit', $event);
          });
        }

        /*jshint camelcase: false */
        var caseJSON = {
          'product': CaseService.kase.product.code,
        'version':
          CaseService.kase.version,
        'summary':
          CaseService.kase.summary,
        'description':
          CaseService.kase.description,
        'severity':
          CaseService.kase.severity.name,
        };

        if (RHAUtils.isNotEmpty(CaseService.group)) {
          caseJSON.folderNumber = CaseService.group;
        }

        if (RHAUtils.isNotEmpty(CaseService.entitlement)) {
          caseJSON.entitlement = {};
          caseJSON.entitlement.sla = CaseService.entitlement;
        }

        if (RHAUtils.isNotEmpty(CaseService.account)) {
          caseJSON.accountNumber = CaseService.account.number;
        }

        if (CaseService.fts) {
          caseJSON.fts = true;
          if (CaseService.fts_contact) {
            caseJSON.contactInfo24X7 = CaseService.fts_contact;
          }
        }

        if (RHAUtils.isNotEmpty(CaseService.owner)) {
          caseJSON.contactSsoUsername = CaseService.owner;
        }

        $scope.submittingCase = true;
        AlertService.addWarningMessage('Creating case...');

        var redirectToCase = function (caseNumber) {
          $state.go('edit', {
            id: caseNumber
          });
          AlertService.clearAlerts();
          $scope.submittingCase = false;
        };

        strataService.cases.post(caseJSON).then(
          function (caseNumber) {
            AlertService.clearAlerts();
            AlertService.addSuccessMessage('Successfully created case number ' + caseNumber);
            if ((AttachmentsService.updatedAttachments.length > 0 || AttachmentsService.hasBackEndSelections()) &&
              NEW_CASE_CONFIG.showAttachments) {

              AttachmentsService.updateAttachments(caseNumber).then(
                function () {
                  redirectToCase(caseNumber);
                });
            } else {
              redirectToCase(caseNumber);
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