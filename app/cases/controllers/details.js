'use strict';

angular.module('RedhatAccessCases')
.controller('Details', [
  '$scope',
  '$stateParams',
  'attachments',
  'caseJSON',
  'attachmentsJSON',
  'commentsJSON',
  'caseTypesJSON',
  'severitiesJSON',
  'groupsJSON',
  'productsJSON',
  'statusesJSON',
  function(
      $scope,
      $stateParams,
      attachments,
      caseJSON,
      attachmentsJSON,
      commentsJSON,
      caseTypesJSON,
      severitiesJSON,
      groupsJSON,
      productsJSON,
      statusesJSON) {

    var originalDetails;

    if (caseJSON) {
      $scope.details = {};
      $scope.details.caseId = $stateParams.id;
      $scope.details.summary = caseJSON.summary;
      $scope.details.description = caseJSON.description;
      $scope.details.type = {'name': caseJSON.type};
      $scope.details.severity = {'name': caseJSON.severity};
      $scope.details.status = {'name': caseJSON.status};
      $scope.details.alternate_id = caseJSON.alternate_id;
      $scope.details.product = {'name': caseJSON.product};
      $scope.details.sla = caseJSON.entitlement.sla;
      $scope.details.contact_name = caseJSON.contact_name;
      $scope.details.owner = caseJSON.owner;
      $scope.details.created_date = caseJSON.created_date;
      $scope.details.created_by = caseJSON.created_by;
      $scope.details.last_modified_date = caseJSON.last_modified_date;
      $scope.details.last_modified_by = caseJSON.last_modified_by;
      $scope.details.account_number = caseJSON.account_number;
      $scope.details.group = {'number': caseJSON.folder_number};

      originalDetails = angular.copy($scope.details);

      $scope.bugzillas = caseJSON.bugzillas;
      $scope.hasBugzillas = Object.getOwnPropertyNames($scope.bugzillas).length != 0;

      if (caseJSON.recommendations) {
        if (Object.getOwnPropertyNames(caseJSON.recommendations).length != 0) {
          $scope.recommendations = caseJSON.recommendations.recommendation;
        }
      }
    }

    if (attachmentsJSON) {
      attachments.items = attachmentsJSON;
      $scope.attachments = attachmentsJSON;
    }

    if (commentsJSON) {
      $scope.comments = commentsJSON;
    }

    if (caseTypesJSON) {
      $scope.caseTypes = caseTypesJSON;
    }

    if (severitiesJSON) {
      $scope.severities = severitiesJSON;
    }

    if (groupsJSON) {
      $scope.groups = groupsJSON;
    }

    if (productsJSON) {
      $scope.products = productsJSON;
    }

    if (statusesJSON) {
      $scope.statuses = statusesJSON;
    }

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
    $scope.details.version = caseJSON.version;

  }]);

