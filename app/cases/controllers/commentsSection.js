'use strict';

angular.module('RedhatAccessCases')
.controller('CommentsSection', [
  '$scope',
  function(
      $scope) {

    $scope.newComment = '';
    $scope.addingComment = false;

    $scope.addComment = function() {
      $scope.addingComment = true;

      strata.cases.comments.post(
          $scope.caseid,
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
  }
]);
