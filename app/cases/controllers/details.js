'use strict';

angular.module('RedhatAccessCases')
.controller('DetailsController', [
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

    if (caseJSON) {
      $scope.caseId = $stateParams.id;
      $scope.summary = caseJSON.summary;
      $scope.description = caseJSON.description;
      $scope.type = {'name': caseJSON.type};
      $scope.severity = {'name': caseJSON.severity};
      $scope.status = {'name': caseJSON.status};
      $scope.alternate_id = caseJSON.alternate_id;

      $scope.product = {'name': caseJSON.product};
      $scope.sla = caseJSON.entitlement.sla;
      $scope.contact_name = caseJSON.contact_name;
      $scope.owner = caseJSON.owner;

      $scope.created_date = caseJSON.created_date;
      $scope.created_by = caseJSON.created_by;
      $scope.last_modified_date = caseJSON.last_modified_date;
      $scope.last_modified_by = caseJSON.last_modified_by;
      $scope.account_number = caseJSON.account_number;
      $scope.group = {'number': caseJSON.folder_number};

      $scope.bugzillas = caseJSON.bugzillas;
      $scope.hasBugzillas = Object.getOwnPropertyNames($scope.bugzillas).length != 0;

      if (Object.getOwnPropertyNames(caseJSON.recommendations).length != 0) {
        $scope.recommendations = caseJSON.recommendations.recommendation;
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

    $scope.getProductVersions($scope.product);
    $scope.version = caseJSON.version;

  }]);

