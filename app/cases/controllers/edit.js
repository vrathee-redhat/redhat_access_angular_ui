'use strict';

angular.module('RedhatAccessCases')
.controller('Edit', [
  '$scope',
  '$stateParams',
  '$filter',
  '$q',
  'attachments',
  'caseJSON',
  'attachmentsJSON',
  'accountJSON',
  'commentsJSON',
  function(
      $scope,
      $stateParams,
      $filter,
      $q,
      attachments,
      caseJSON,
      attachmentsJSON,
      accountJSON,
      commentsJSON) {

    if (caseJSON) {
      $scope.caseId = $stateParams.id;
      $scope.caseJSON = caseJSON;

      $scope.bugzillas = caseJSON.bugzillas;
      $scope.hasBugzillas = Object.getOwnPropertyNames($scope.bugzillas).length != 0;

      if (caseJSON.recommendations) {
        if (Object.getOwnPropertyNames(caseJSON.recommendations).length != 0) {
          $scope.recommendations = caseJSON.recommendations.recommendation;
        }
      }

      $scope.title = 'Case ' + $scope.caseId;
    }

    $scope.attachments = attachmentsJSON;

    if (commentsJSON) {
      $scope.comments = commentsJSON;
    }



    $scope.newComment = '';
    $scope.addingComment = false;

    $scope.addComment = function() {
      $scope.addingComment = true;

      strata.cases.comments.post(
        $scope.caseId,
        {'text': $scope.newComment},
        function(response) {

          //refresh the comments list
          strata.cases.comments.get(
            $scope.caseId,
            function(comments) {
              $scope.newComment = '';
              $scope.comments = comments;
              $scope.addingComment = false;
              $scope.$apply();
            },
            function(error) {
              console.log(error);
            }
          );
        },
        function(error) {
          console.log(error);
        }
      );
    };


  }]);

