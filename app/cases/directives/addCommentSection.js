'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaAddCommentSection', function () {
  return {
    templateUrl: 'cases/views/addCommentSection.html',
    restrict: 'E',
    controller: 'AddCommentSection'
  };
});
