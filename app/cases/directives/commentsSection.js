'use strict';

angular.module('RedhatAccessCases')
.directive('rhaCaseComments', function () {
return {
  templateUrl: 'cases/views/commentsSection.html',
  controller: 'CommentsSection',
  scope: {
    caseid: '=',
    comments: '='
  },
  restrict: 'EA',
  link: function postLink(scope, element, attrs) {
  }
};
});
