'use strict';

angular.module('RedhatAccess.cases')
.controller('CommentsSection', [
  '$scope',
  'CaseService',
  'strataService',
  '$stateParams',
  function(
      $scope,
      CaseService,
      strataService,
      $stateParams) {

    strataService.cases.comments.get($stateParams.id).then(
        function(commentsJSON) {
          $scope.comments = commentsJSON;
          $scope.selectPage(1);
        },
        function(error) {
          console.log(error);
        }
    );

    $scope.newComment = '';
    $scope.addingComment = false;

    $scope.addComment = function() {
      $scope.addingComment = true;

      strata.cases.comments.post(
          CaseService.case.case_number,
          {'text': $scope.newComment},
          function(response) {

            //refresh the comments list
            strata.cases.comments.get(
                CaseService.case.case_number,
                function(comments) {
                  $scope.newComment = '';
                  $scope.comments = comments;
                  $scope.addingComment = false;
                  $scope.selectPage(1);
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

    $scope.itemsPerPage = 4;
    $scope.maxPagerSize = 3;

    $scope.selectPage = function(pageNum) {
      var start = $scope.itemsPerPage * (pageNum - 1);
      var end = start + $scope.itemsPerPage;
      end = end > $scope.comments.length ?
          $scope.comments.length : end;

      $scope.commentsOnScreen =
          $scope.comments.slice(start, end);
    };

    if ($scope.comments != null) {
      $scope.selectPage(1);
    }
  }
]);
