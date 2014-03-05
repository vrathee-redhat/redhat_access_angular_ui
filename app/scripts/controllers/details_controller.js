'use strict';

angular.module('RedhatAccessCases')
  .controller(
    'DetailsController',
    function ($scope, $stateParams, caseJSON, attachmentsJSON, commentsJSON) {
      if (caseJSON) {
        $scope.caseId = $stateParams.id;
        $scope.summary = caseJSON.summary;
        $scope.description = caseJSON.description;
        $scope.type = caseJSON.type;
        $scope.severity = caseJSON.severity;
        $scope.status = caseJSON.status;
        $scope.alternate_id = caseJSON.alternate_id;

        $scope.product = caseJSON.product;
        $scope.sla = caseJSON.entitlement.sla;
        $scope.contact_name = caseJSON.contact_name;
        $scope.owner = caseJSON.owner;

        $scope.created_date = caseJSON.created_date;
        $scope.created_by = caseJSON.created_by;
        $scope.last_modified_date = caseJSON.last_modified_date;
        $scope.last_modified_by = caseJSON.last_modified_by;
        $scope.account_number = caseJSON.account_number;

        $scope.bugzillas = caseJSON.bugzillas;
        $scope.hasBugzillas = Object.getOwnPropertyNames($scope.bugzillas).length != 0;

        if (Object.getOwnPropertyNames(caseJSON.recommendations).length != 0) {
          $scope.recommendations = caseJSON.recommendations.recommendation;
        }
      }

      if (attachmentsJSON) {
        $scope.attachments = attachmentsJSON;
      }

      if (commentsJSON) {
        $scope.comments = commentsJSON;
      }
    });
