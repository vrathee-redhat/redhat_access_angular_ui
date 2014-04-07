'use strict';

angular.module('RedhatAccessCases')
.controller('DetailsSection', [
  '$scope',
  'strataService',
  function(
      $scope,
      strataService) {

    strataService.values.cases.types().then(
        function(response) {
          $scope.caseTypes = response;
        }
    );
    strataService.values.cases.severity().then(
        function(response) {
          $scope.severities = response;
        }
    );
    strataService.groups.list().then(
        function(response) {
          $scope.groups = response;
        }
    );
    strataService.products.list().then(
        function(response) {
          $scope.products = response;
        }
    );
    strataService.values.cases.status().then(
        function(response) {
          $scope.statuses = response;
        }
    );

    $scope.updatingDetails = false;

    $scope.updateCase = function() {
      $scope.updatingDetails = true;

      var caseJSON = {
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
