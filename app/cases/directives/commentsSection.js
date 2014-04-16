'use strict';

angular.module('RedhatAccessCases')
.directive('rhaCaseComments', function () {
return {
  templateUrl: 'cases/views/commentsSection.html',
  controller: 'CommentsSection',
  restrict: 'EA',
  link: function postLink(scope, element, attrs) {
  }
};
});
