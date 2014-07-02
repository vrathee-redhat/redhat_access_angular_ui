'use strict';
 /*jshint camelcase: false */
angular.module('RedhatAccess.cases')
.controller('DetailsSection', [
  '$scope',
  'strataService',
  'CaseService',
  '$rootScope',
  'AUTH_EVENTS',
  'AlertService',
  'RHAUtils',
  function(
      $scope,
      strataService,
      CaseService,
      $rootScope,
      AUTH_EVENTS,
      AlertService,
      RHAUtils) {

    $scope.CaseService = CaseService;

    $scope.init = function() {
      if (!$scope.compact) {

        strataService.values.cases.types().then(
            function(response) {
              $scope.caseTypes = response;
            },
            function(error) {
              AlertService.addStrataErrorMessage(error);
            }
        );

        strataService.groups.list().then(
            function(response) {
              $scope.groups = response;
            },
            function(error) {
              AlertService.addStrataErrorMessage(error);
            }
        );
      }

      strataService.values.cases.status().then(
          function(response) {
            $scope.statuses = response;
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
          }
      );

      strataService.values.cases.severity().then(
          function(response) {
            CaseService.severities = response;
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
          }
      );

      strataService.products.list().then(
          function(response) {
            $scope.products = response;
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
          }
      );
    };
    $scope.init();

    $scope.updatingDetails = false;
    $scope.updateCase = function() {
      $scope.updatingDetails = true;

      var caseJSON = {};
      if (CaseService.case != null) {
        if (CaseService.case.type != null) {
          caseJSON.type = CaseService.case.type.name;
        }
        if (CaseService.case.severity != null) {
          caseJSON.severity = CaseService.case.severity.name;
        }
        if (CaseService.case.status != null) {
          caseJSON.status = CaseService.case.status.name;
        }
        if (CaseService.case.alternate_id != null) {
          caseJSON.alternateId = CaseService.case.alternate_id;
        }
        if (CaseService.case.product != null) {
          caseJSON.product = CaseService.case.product.name;
        }
        if (CaseService.case.version != null) {
          caseJSON.version = CaseService.case.version;
        }
        if (CaseService.case.summary != null) {
          caseJSON.summary = CaseService.case.summary;
        }
        if (CaseService.case.group != null) {
          caseJSON.folderNumber = CaseService.case.group.number;
        }
        if (RHAUtils.isNotEmpty(CaseService.case.fts)) {
          caseJSON.fts = CaseService.case.fts;
          if (!CaseService.case.fts) {
            caseJSON.contactInfo24X7 = '';
          }
        }
        if (CaseService.case.fts && RHAUtils.isNotEmpty(CaseService.case.contact_info24_x7)) {
          caseJSON.contactInfo24X7 = CaseService.case.contact_info24_x7;
        }

        strataService.cases.put(CaseService.case.case_number, caseJSON).then(
            function() {
              $scope.caseDetails.$setPristine();
              $scope.updatingDetails = false;
              $scope.$apply();
            },
            function(error) {
              AlertService.addStrataErrorMessage(error);
              $scope.updatingDetails = false;
              $scope.$apply();
            }
        );
      }
    };

    $scope.getProductVersions = function() {
      CaseService.versions = [];

      strataService.products.versions(CaseService.case.product.code).then(
          function(versions){
            CaseService.versions = versions;
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
          }
      );
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      $scope.init();
      AlertService.clearAlerts();
    });
  }
]);
