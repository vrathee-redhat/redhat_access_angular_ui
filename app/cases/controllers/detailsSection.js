'use strict';

angular.module('RedhatAccessCases')
.controller('DetailsSection', [
  '$scope',
  'strataService',
  function(
      $scope,
      strataService) {

    $scope.details = {};

    if (!$scope.compact) {
      $scope.details.type = {'name': $scope.casejson.type};
      $scope.details.alternate_id = $scope.casejson.alternate_id;
      $scope.details.sla = $scope.casejson.entitlement.sla;
      $scope.details.contact_name = $scope.casejson.contact_name;
      $scope.details.owner = $scope.casejson.owner;
      $scope.details.created_date = $scope.casejson.created_date;
      $scope.details.created_by = $scope.casejson.created_by;
      $scope.details.last_modified_date = $scope.casejson.last_modified_date;
      $scope.details.last_modified_by = $scope.casejson.last_modified_by;
      $scope.details.account_number = $scope.casejson.account_number;
      $scope.details.group = {'number': $scope.casejson.folder_number};

//    if (accountJSON !== null) {
//      $scope.details.account_name = $scope.accountName;
//    }

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

    $scope.details.summary = $scope.casejson.summary;
    $scope.details.severity = {'name': $scope.casejson.severity};
    $scope.details.status = {'name': $scope.casejson.status};
    $scope.details.product = {'name': $scope.casejson.product};
    $scope.details.version = $scope.casejson.version;

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

      var casejson = {
        'type': $scope.details.type.name,
        'severity': $scope.details.severity.name,
        'status': $scope.details.status.name,
        'alternateId': $scope.details.alternate_id,
//        'notes': $scope.details.notes,
        'product': $scope.details.product.name,
        'version': $scope.details.version,
        'summary': $scope.details.summary,
        'folderNumber': $scope.details.group.number
      };

      strata.cases.put(
          $scope.details.caseId,
          casejson,
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
    };

    $scope.getProductVersions = function(product) {
      $scope.version = "";
      $scope.versions = undefined;

      strata.products.versions(
          product.name,
          function(response){
            $scope.versions = response;
            $scope.$apply();
          },
          function(error){
            console.log(error);
          });
    };

    $scope.getProductVersions($scope.details.product);
  }
]);
