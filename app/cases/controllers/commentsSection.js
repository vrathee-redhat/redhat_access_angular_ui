'use strict';
 /*jshint unused:vars */
 /*jshint camelcase: false */

angular.module('RedhatAccess.cases')
.controller('CommentsSection', [
  '$scope',
  'CaseService',
  'strataService',
  '$stateParams',
  'AlertService',
  function(
      $scope,
      CaseService,
      strataService,
      $stateParams,
      AlertService) {

    strataService.cases.comments.get($stateParams.id).then(
        function(commentsJSON) {
          $scope.comments = commentsJSON;

          if (commentsJSON != null) {
            $scope.selectPage(1);
          }
        },
        function(error) {
          AlertService.addStrataErrorMessage(error);
        }
    );

    $scope.newComment = '';
    $scope.addingComment = false;

    $scope.addComment = function() {
      $scope.addingComment = true;

      strataService.cases.comments.post(CaseService.case.case_number, $scope.newComment).then(
          function(response) {
            strataService.cases.comments.get(CaseService.case.case_number).then(
                function(comments) {
                  $scope.newComment = '';
                  $scope.comments = comments;
                  $scope.addingComment = false;
                  $scope.selectPage(1);
                  $scope.$apply();
                },
                function(error) {
                  AlertService.addStrataErrorMessage(error);
                });
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
            $scope.addingComment = false;
          });
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
