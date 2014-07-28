'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaAddcommentsection', function () {
  return {
    templateUrl: 'cases/views/addCommentSection.html',
    restrict: 'A',
    controller: 'AddCommentSection'
  };
});
