'use strict';

angular.module('RedhatAccessCases')
.controller('DetailsSection', [
  '$scope',
  'strataService',
  'CaseService',
  function(
      $scope,
      strataService,
      CaseService) {

    $scope.CaseService = CaseService;

    if (!$scope.compact) {

      strataService.values.cases.types().then(
          function(response) {
            $scope.caseTypes = response;
          }
      );

      strataService.groups.list().then(
          function(response) {
            $scope.groups = response;
          }
      );
    }

    strataService.values.cases.status().then(
        function(response) {
          $scope.statuses = response;
        }
    );

    strataService.values.cases.severity().then(
        function(response) {
          $scope.severities = response;
        }
    );

    strataService.products.list().then(
        function(response) {
          $scope.products = response;
        }
    );

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
          caseJSON.alternate_id = CaseService.case.alternate_id;
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

        strata.cases.put(
            CaseService.case.case_number,
            caseJSON,
            function() {
              $scope.caseDetails.$setPristine();
              $scope.updatingDetails = false;
              $scope.$apply();
            },
            function(error) {
              console.log(error);
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
          }
      );
    };
  }
]);
